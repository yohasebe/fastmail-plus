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
