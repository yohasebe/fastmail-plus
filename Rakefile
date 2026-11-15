# frozen_string_literal: true

require "json"

# Files shipped in the extension packages: an allowlist of patterns, matched
# against git-tracked files only, so untracked or newly added files never ship
# unless they are listed here.
PACKAGE_PATTERNS = %w[
  _locales/*/messages.json
  content/*.js
  content/*.css
  images/fastmail-plus-16.png
  images/fastmail-plus-48.png
  images/fastmail-plus-128.png
  options.html
  options.js
  LICENSE
].freeze

MANIFEST = "manifests/manifest.v3.json"
CHROME_ZIP = "fastmail-plus-chrome.zip"

def package_files(patterns)
  tracked = `git ls-files -z`.split("\0")
  tracked.select { |f| patterns.any? { |pat| File.fnmatch?(pat, f, File::FNM_PATHNAME) } }.sort
end

# Zip exactly the given files plus manifest.json (no directory walking).
def write_zip(zip, files)
  File.delete(zip) if File.exist?(zip)
  IO.popen(["zip", "-X", "-q", zip, "-@"], "w") { |io| io.puts(files + ["manifest.json"]) }
  abort "zip failed for #{zip}" unless $?.success?
end

desc "Build the Chrome package"
task :build do
  version = JSON.parse(File.read(MANIFEST))["version"]
  html = File.read("options.html")
  File.write("options.html", html.sub(%r{<span class='version'>.*?</span>}) { "<span class='version'>#{version}</span>" })

  # Zip a real copy of the manifest (not the dogfooding symlink), then restore
  # the symlink so the unpacked extension stays loadable (manifest.json is gitignored).
  `rm -f manifest.json`
  `cp #{MANIFEST} manifest.json`
  write_zip(CHROME_ZIP, package_files(PACKAGE_PATTERNS))
  `rm -f manifest.json`
  `ln -sf #{MANIFEST} manifest.json`
end

# Check a built package by opening it: its entries must be exactly the
# allowlisted tracked files plus manifest.json, and every entry must match the
# committed (HEAD) content byte for byte, so only committed files can be published.
def verify_package(zip, patterns, manifest_source)
  abort "#{zip} not found. Run `rake build` first." unless File.exist?(zip)

  expected = package_files(patterns)
  sources = expected.to_h { |f| [f, f] }.merge("manifest.json" => manifest_source)
  entries = `zipinfo -1 #{zip}`.split("\n").reject { |e| e.end_with?("/") }

  errors = []
  (entries - sources.keys).each { |e| errors << "unexpected entry: #{e}" }
  (sources.keys - entries).each { |e| errors << "missing entry: #{e}" }
  (entries & sources.keys).each do |entry|
    packed = IO.popen(["unzip", "-p", zip, entry], "rb", &:read)
    committed = IO.popen(["git", "show", "HEAD:#{sources[entry]}"], "rb", err: File::NULL, &:read)
    errors << "differs from HEAD: #{entry}" unless $?.success? && packed == committed
  end

  abort "Package check failed for #{zip}:\n  #{errors.join("\n  ")}" unless errors.empty?
  puts "Package check passed for #{zip}: #{entries.size} entries match the allowlist and HEAD."
end

def verify_chrome_package
  verify_package(CHROME_ZIP, PACKAGE_PATTERNS, MANIFEST)
end

desc "Render the SVG mockups to PNG for the Chrome Web Store listing (build/store/)"
task :store_images do
  FileUtils.mkdir_p("build/store")
  Dir.glob("images/mockups/*.svg").each do |svg|
    sh "rsvg-convert", svg, "-o", File.join("build/store", File.basename(svg, ".svg") + ".png")
  end
end

desc "Check the built package against the allowlist and HEAD (run before publishing)"
task :verify do
  verify_chrome_package
end

desc "Link manifest.json for loading the unpacked extension"
task :chrome do
  `ln -sf #{MANIFEST} manifest.json`
end

# --- Chrome Web Store publishing -------------------------------------------
# Load credentials from a gitignored .env.webstore into ENV (existing shell env
# vars win, which is handy for CI). See docs/publishing.md for setup.
def load_webstore_env(path = ".env.webstore")
  return unless File.exist?(path)

  File.foreach(path) do |line|
    line = line.strip
    next if line.empty? || line.start_with?("#")

    key, value = line.split("=", 2)
    ENV[key.strip] ||= value.strip if key && value
  end
end

WEBSTORE_KEYS = %w[EXTENSION_ID CLIENT_ID CLIENT_SECRET REFRESH_TOKEN].freeze

desc "Build, then upload the Chrome package to the Web Store as a DRAFT (does NOT publish)"
task upload: :build do
  verify_chrome_package
  load_webstore_env

  zip = CHROME_ZIP

  missing = WEBSTORE_KEYS.select { |k| ENV[k].to_s.strip.empty? }
  unless missing.empty?
    abort "Missing #{missing.join(", ")}. Put them in .env.webstore (see .env.webstore.example)."
  end

  # The CLI reads CLIENT_ID / CLIENT_SECRET / REFRESH_TOKEN from ENV, so the
  # secrets are never passed on argv (kept out of the process list). Only the
  # non-secret extension id is passed as a flag. Pinned to major v3.
  sh "npx", "--yes", "chrome-webstore-upload-cli@3",
     "upload", "--source", zip, "--extension-id", ENV["EXTENSION_ID"]

  puts ""
  puts "Uploaded as a DRAFT (not published). Review and click Publish here:"
  puts "  https://chrome.google.com/webstore/devconsole"
  puts "Tip: bump the version in manifests/*.json before the next upload."
end
