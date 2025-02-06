{ pkgs ? import <nixos-unstable> {} }:
  pkgs.mkShell {
	nativeBuildInputs = with pkgs; [
		nodejs
		yarn
		cypress
	];

    shellHook = ''
	  export CYPRESS_INSTALL_BINARY=0
	  export CYPRESS_RUN_BINARY=${pkgs.cypress}/bin/Cypress
	'';
}

