{
  description = "Mon Entreprise";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
              nodejs-18_x
              yarn
              cypress
            ];

            shellHook = ''
              export CYPRESS_INSTALL_BINARY=0
              export CYPRESS_RUN_BINARY=${pkgs.cypress}/bin/Cypress
              export NODE_ENV=development

              # Force pure mode indication if your prompt is displaying impure
              export IN_NIX_SHELL=pure
            '';
          };
        });
    };
}
