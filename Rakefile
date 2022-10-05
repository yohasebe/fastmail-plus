require 'json'

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

    version = JSON.parse(File.read(m))["version"]
    updated = ""

    File.open("options.html", "r") do |f|
      updated = f.read.sub(/<span class='version'>.*?<\/span>/){"<span class='version'>#{version}</span>"}
    end

    File.open("options.html", "w") do |f|
      f.write(updated)
    end

    case m
    when /\.v3\.json\z/
      `ln #{m} manifest.json`
      `ln browsers/chrome/background-script.js background-script.js`
      `ln browsers/chrome/content/display_num_messages.js content/display_num_messages.js`
      `zip -r fastmail-plus-chrome.zip #{components.join(" ")}`
    when /\.v2\.json\z/
      `ln #{m} manifest.json`
      `ln browsers/firefox/background-script.js background-script.js`
      `ln browsers/firefox/content/display_num_messages.js content/display_num_messages.js`
      `zip -r fastmail-plus-firefox.zip #{components.join(" ")}`
    end
    `rm manifest.json`
    `rm background-script.js`
    `rm content/display_num_messages.js`
  end
end

desc "switches to Firefox as main manifest"
task :firefox do
  `ln --force --symbolic manifests/manifest.v2.json manifest.json`
  `ln --force --symbolic browsers/firefox/background-script.js background-script.js`
  `ln --force --symbolic browsers/firefox/content/display_num_messages.js content/display_num_messages.js`
end

desc "switches to Chrome as main manifest"
task :chrome do
  `ln --force --symbolic manifests/manifest.v3.json manifest.json`
  `ln --force --symbolic browsers/chrome/background-script.js background-script.js`
  `ln --force --symbolic browsers/chrome/content/display_num_messages.js content/display_num_messages.js`
end
