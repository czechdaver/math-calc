{
  pkgs, ... }: {
  # Use the latest stable channel for Nix packages.
  channel = "stable-24.05";

  # Define the packages available in the development environment.
  packages = [
    pkgs.nodejs_20 # Node.js 20 for Next.js development.
  ];

  # Configure workspace settings.
  idx = {
    # Install recommended VS Code extensions.
    extensions = [
      "dbaeumer.vscode-eslint" # ESLint for code linting.
      "esbenp.prettier-vscode" # Prettier for code formatting.
       "bradlc.vscode-tailwindcss" # Tailwind CSS extension
       "remixerl.firebase-vscode" # Firebase extension
    ];

    # Define workspace lifecycle hooks.
    workspace = {
      # Commands to run when the workspace is first created.
      onCreate = {
        npm-install = "npm install"; # Install Node.js dependencies.
      };

      # Commands to run every time the workspace is started.
      onStart = {
        dev-server = "npm run dev"; # Start the Next.js development server.
      };
    };

    # Configure web previews.
    previews = {
      enable = true; # Enable web previews.
      # Define the web preview configuration.
      previews = {
        web = {
          command = ["npm", "run", "dev", "--", "--port", "$PORT"]; # Command to start the development server with the assigned port.
          manager = "web"; # Use the web preview manager.
        };
      };
    };
  };
}
