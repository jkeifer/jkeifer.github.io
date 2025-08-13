# Notes on nix

## References

### General
https://nixos.org/manual/nix/stable/
https://ejpcmac.net/blog/about-using-nix-in-my-development-workflow/

### MacOS
https://wickedchicken.github.io/post/macos-nix-setup/
https://dev.to/louy2/use-nix-on-macos-as-a-homebrew-user-22d
https://www.mathiaspolligkeit.de/dev/exploring-nix-on-macos/
https://github.com/LnL7/nix-darwin

### Python venvs
https://github.com/DavHau/mach-nix
https://nixos.wiki/wiki/Python
https://www.tweag.io/blog/2020-08-12-poetry2nix/
https://github.com/nix-community/poetry2nix


## Installing nix on MacOS
See https://nixos.org/manual/nix/stable/#sect-macos-installation

```
$ sh <(curl -L https://nixos.org/nix/install) --darwin-use-unencrypted-nix-store-volume
```

Note this is not really an unencrypted installation on macs with the T2 chip.

### nix-darwin
- Tool to replicate NixOS-like management for system packages
- Basic installation from README
- How I instead integrated into my dotfiles bootstrapping


## zsh integration
- want to use zinit as sa plugin manager
  - trying to update dotfiles bootstrap to install it


https://github.com/zdharma/zinit



## Crazy idea
https://github.com/kclejeune/system

Totally spiraling, but this declarative sys config seems really interesting...


### Setting MacOS "defaults"
https://pawelgrzybek.com/change-macos-user-preferences-via-command-line/
Notice the tip on diffing the setttings after a change.
We can use that to work out what needs to be changed via nix.

https://serokell.io/blog/practical-nix-flakes

