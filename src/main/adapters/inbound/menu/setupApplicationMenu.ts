import {Menu} from "electron";

type SetupApplicationMenuOptions = {
  appName: string;
  appVersion: string;
  onAboutRequested: () => Promise<void>;
  onSettingsRequested: () => Promise<void>;
};

export const setupApplicationMenu = ({
  appName,
  appVersion,
  onAboutRequested,
  onSettingsRequested
}: SetupApplicationMenuOptions): void => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          label: "Settings",
          click: async () => {
            await onSettingsRequested();
          }
        }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: `About ${appName} (${appVersion})`,
          click: async () => {
            await onAboutRequested();
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

