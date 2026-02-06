{
  description = "example-node-js-flake - From https://nixos.wiki/wiki/Node.js";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

#        buildNodeJs = pkgs.callPackage "${<nixpkgs>}/pkgs/development/web/nodejs/nodejs.nix" {
#          python = pkgs.python311;
#        };

#        nodejs = buildNodeJs {
#          enableNpm = true;
#          version = "20.5.1";
#          sha256 = "sha256-Q5xxqi84woYWV7+lOOmRkaVxJYBmy/1FSFhgScgTQZA=";
#        };
        nodejs = pkgs.nodejs_24;
      in rec {
        flakedPkgs = pkgs;

        # enables use of `nix shell`
        devShell = pkgs.mkShell {
          # add things you want in your shell here
          buildInputs = with pkgs; [
            nodejs
            tailwindcss
            chromium
          ];
        };
      }
    );
}
