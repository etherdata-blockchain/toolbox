import { ipcRenderer } from "electron";
import { ElectronChannels } from "../../shared/event_names";

interface FileFilter {
  // Docs: https://electronjs.org/docs/api/structures/file-filter

  extensions: string[];
  name: string;
}

interface SaveDialogOptions {
  /**
   * The dialog title. Cannot be displayed on some _Linux_ desktop environments.
   */
  title?: string;
  /**
   * Absolute directory path, absolute file path, or file name to use by default.
   */
  defaultPath?: string;
  /**
   * Custom label for the confirmation button, when left empty the default label will
   * be used.
   */
  buttonLabel?: string;
  filters?: FileFilter[];
  /**
   * Message to display above text fields.
   *
   * @platform darwin
   */
  message?: string;
  /**
   * Custom label for the text displayed in front of the filename text field.
   *
   * @platform darwin
   */
  nameFieldLabel?: string;
  /**
   * Show the tags input box, defaults to `true`.
   *
   * @platform darwin
   */
  showsTagField?: boolean;
  properties?: Array<
    | "showHiddenFiles"
    | "createDirectory"
    | "treatPackageAsDirectory"
    | "showOverwriteConfirmation"
    | "dontAddToRecent"
  >;
  /**
   * Create a security scoped bookmark when packaged for the Mac App Store. If this
   * option is enabled and the file doesn't already exist a blank file will be
   * created at the chosen path.
   *
   * @platform darwin,mas
   */
  securityScopedBookmarks?: boolean;
}

interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  /**
   * Custom label for the confirmation button, when left empty the default label will
   * be used.
   */
  buttonLabel?: string;
  filters?: FileFilter[];
  /**
   * Contains which features the dialog should use. The following values are
   * supported:
   */
  properties?: Array<
    | "openFile"
    | "openDirectory"
    | "multiSelections"
    | "showHiddenFiles"
    | "createDirectory"
    | "promptToCreate"
    | "noResolveAliases"
    | "treatPackageAsDirectory"
    | "dontAddToRecent"
  >;
  /**
   * Message to display above input boxes.
   *
   * @platform darwin
   */
  message?: string;
  /**
   * Create security scoped bookmarks when packaged for the Mac App Store.
   *
   * @platform darwin,mas
   */
  securityScopedBookmarks?: boolean;
}

interface SaveDialogReturnValue {
  /**
   * whether or not the dialog was canceled.
   */
  canceled: boolean;
  /**
   * If the dialog is canceled, this will be `undefined`.
   */
  filePath?: string;
  /**
   * Base64 encoded string which contains the security scoped bookmark data for the
   * saved file. `securityScopedBookmarks` must be enabled for this to be present.
   * (For return values, see table here.)
   *
   * @platform darwin,mas
   */
  bookmark?: string;
}

interface OpenDialogReturnValue {
  /**
   * whether or not the dialog was canceled.
   */
  canceled: boolean;
  /**
   * An array of file paths chosen by the user. If the dialog is cancelled this will
   * be an empty array.
   */
  filePaths: string[];
  /**
   * An array matching the `filePaths` array of base64 encoded strings which contains
   * security scoped bookmark data. `securityScopedBookmarks` must be enabled for
   * this to be populated. (For return values, see table here.)
   *
   * @platform darwin,mas
   */
  bookmarks?: string[];
}

interface SaveDialogReturnValue {
  /**
   * whether or not the dialog was canceled.
   */
  canceled: boolean;
  /**
   * If the dialog is canceled, this will be `undefined`.
   */
  filePath?: string;
  /**
   * Base64 encoded string which contains the security scoped bookmark data for the
   * saved file. `securityScopedBookmarks` must be enabled for this to be present.
   * (For return values, see table here.)
   *
   * @platform darwin,mas
   */
  bookmark?: string;
}

interface MessageBoxOptions {
  /**
   * Content of the message box.
   */
  message: string;
  /**
   * Can be `"none"`, `"info"`, `"error"`, `"question"` or `"warning"`. On Windows,
   * `"question"` displays the same icon as `"info"`, unless you set an icon using
   * the `"icon"` option. On macOS, both `"warning"` and `"error"` display the same
   * warning icon.
   */
  type?: string;
  /**
   * Array of texts for buttons. On Windows, an empty array will result in one button
   * labeled "OK".
   */
  buttons?: string[];
  /**
   * Index of the button in the buttons array which will be selected by default when
   * the message box opens.
   */
  defaultId?: number;
  /**
   * Pass an instance of AbortSignal to optionally close the message box, the message
   * box will behave as if it was cancelled by the user. On macOS, `signal` does not
   * work with message boxes that do not have a parent window, since those message
   * boxes run synchronously due to platform limitations.
   */
  signal?: AbortSignal;
  /**
   * Title of the message box, some platforms will not show it.
   */
  title?: string;
  /**
   * Extra information of the message.
   */
  detail?: string;
  /**
   * If provided, the message box will include a checkbox with the given label.
   */
  checkboxLabel?: string;
  /**
   * Initial checked state of the checkbox. `false` by default.
   */
  checkboxChecked?: boolean;
  icon?: any | string;
  /**
   * Custom width of the text in the message box.
   *
   * @platform darwin
   */
  textWidth?: number;
  /**
   * The index of the button to be used to cancel the dialog, via the `Esc` key. By
   * default this is assigned to the first button with "cancel" or "no" as the label.
   * If no such labeled buttons exist and this option is not set, `0` will be used as
   * the return value.
   */
  cancelId?: number;
  /**
   * On Windows Electron will try to figure out which one of the `buttons` are common
   * buttons (like "Cancel" or "Yes"), and show the others as command links in the
   * dialog. This can make the dialog appear in the style of modern Windows apps. If
   * you don't like this behavior, you can set `noLink` to `true`.
   */
  noLink?: boolean;
  /**
   * Normalize the keyboard access keys across platforms. Default is `false`.
   * Enabling this assumes `&` is used in the button labels for the placement of the
   * keyboard shortcut access key and labels will be converted so they work correctly
   * on each platform, `&` characters are removed on macOS, converted to `_` on
   * Linux, and left untouched on Windows. For example, a button label of `Vie&w`
   * will be converted to `Vie_w` on Linux and `View` on macOS and can be selected
   * via `Alt-W` on Windows and Linux.
   */
  normalizeAccessKeys?: boolean;
}

interface MessageBoxReturnValue {
  /**
   * The index of the clicked button.
   */
  response: number;
  /**
   * The checked state of the checkbox if `checkboxLabel` was set. Otherwise `false`.
   */
  checkboxChecked: boolean;
}

export class ElectronDialog {
  static async showSaveDialog(
    options: SaveDialogOptions
  ): Promise<SaveDialogReturnValue> {
    return ipcRenderer.invoke(ElectronChannels.showSaveDialog, options);
  }
  static async showOpenDialog(
    options: OpenDialogOptions
  ): Promise<OpenDialogReturnValue> {
    return ipcRenderer.invoke(ElectronChannels.showOpenDialog, options);
  }

  static async showMessageBox(
    options: MessageBoxOptions
  ): Promise<MessageBoxReturnValue> {
    return ipcRenderer.invoke(ElectronChannels.showMessageDialog, options);
  }
}
