Vagrant.configure("2") do |config|
  config.vm.box = "perk/ubuntu-2204-arm64"
  config.vm.box_version = "20230712"
  libvirt.machine_virtual_size = '50G'
  config.vm.synced_folder ".", "/vagrant", disabled: true
end