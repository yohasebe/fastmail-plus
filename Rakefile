# frozen_string_literal: true

require "json"

desc "Build packages"
task :build do
  components = [
    "_locales",
    "content",
    "images",
    "libraries",
    "svg",
    "LICENSE",
    "options.html",
    "options.js",
    "README.md",
    "manifest.json"
  ]

  base = File.dirname(__FILE__)

  manifests = File.join(base, "manifests", "*")

  Dir.glob(manifests).each do |m|
    version = JSON.parse(File.read(m))["version"]
    updated = ""

    File.open("options.html", "r") do |f|
      updated = f.read.sub(%r{<span class='version'>.*?</span>}) { "<span class='version'>#{version}</span>" }
    end

    File.open("options.html", "w") do |f|
      f.write(updated)
    end

    # Build a clean zip each time: `zip -r` only appends, so without removing the
    # old archive first, deleted/renamed files (and .DS_Store) linger in it.
    excludes = %w[*.DS_Store __MACOSX*].map { |p| %(-x "#{p}") }.join(" ")
    # Clear any leftover manifest.json (e.g. the `rake chrome` symlink) so `ln`
    # below doesn't fail with "File exists".
    `rm -f manifest.json`
    case m
    when /\.v3\.json\z/
      `ln #{m} manifest.json`
      `rm -f fastmail-plus-chrome.zip`
      `zip -r fastmail-plus-chrome.zip #{components.join(" ")} #{excludes}`
    when /\.v2\.json\z/
      `ln #{m} manifest.json`
      `rm -f fastmail-plus-firefox.zip`
      `zip -r fastmail-plus-firefox.zip #{components.join(" ")} #{excludes}`
    end
    `rm -f manifest.json`
  end

  # Leave a Chrome manifest.json symlink so the unpacked extension stays loadable
  # for local dogfooding (manifest.json is gitignored).
  `ln -sf manifests/manifest.v3.json manifest.json`
end

desc "switches to Firefox as main manifest"
task :firefox do
  # -sf works on both GNU and BSD (macOS); the old `--force --symbolic` fails with macOS ln
  `ln -sf manifests/manifest.v2.json manifest.json`
end

desc "switches to Chrome as main manifest"
task :chrome do
  `ln -sf manifests/manifest.v3.json manifest.json`
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
  load_webstore_env

  zip = "fastmail-plus-chrome.zip"
  abort "Build did not produce #{zip}" unless File.exist?(zip)

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
