desc "Build packages"
task :build do
  components = [
    "_locales",
    "content",
    "images",
    "libraries",
    "svg",
    "background-script.js",
    "LICENSE",
    "options.html",
    "options.js",
    "README.md",
    "manifest.json"
  ]

  base = File.dirname(__FILE__)

  manifests = File.join(base, "manifests", "*")
  manifest = File.join(base, "manifest.json")

  Dir.glob(manifests).each do |m|
    case m
    when /\.v3\.json\z/
      `ln #{m} #{manifest}`
      `zip -r fastmail-plus-chrome.zip #{components.join(" ")}`
      `rm #{manifest}`
    when /\.v2\.json\z/
      `ln #{m} #{manifest}`
      `zip -r fastmail-plus-firefox.zip #{components.join(" ")}`
      `rm #{manifest}`
    end
  end
end

desc "switches to Firefox as main manifest"
task :firefox do
  `ln --force --symbolic manifests/manifest.v2.json manifest.json`
end

desc "switches to Chrome as main manifest"
task :chrome do
  `ln --force --symbolic manifests/manifest.v3.json manifest.json`
end
