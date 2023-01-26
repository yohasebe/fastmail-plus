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

    case m
    when /\.v3\.json\z/
      `ln #{m} manifest.json`
      `zip -r fastmail-plus-chrome.zip #{components.join(" ")}`
    when /\.v2\.json\z/
      `ln #{m} manifest.json`
      `zip -r fastmail-plus-firefox.zip #{components.join(" ")}`
    end
    `rm manifest.json`
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
