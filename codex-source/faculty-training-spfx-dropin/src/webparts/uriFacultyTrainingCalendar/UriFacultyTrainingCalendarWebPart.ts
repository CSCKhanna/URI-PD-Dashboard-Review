import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "UriFacultyTrainingCalendarWebPartStrings";
import styles from "./UriFacultyTrainingCalendarWebPart.module.scss";
import { buildCalendarHtml } from "./calendarHtml";

export interface IUriFacultyTrainingCalendarWebPartProps {
  title: string;
}

export default class UriFacultyTrainingCalendarWebPart extends BaseClientSideWebPart<IUriFacultyTrainingCalendarWebPartProps> {
  private _iframe: HTMLIFrameElement | undefined;

  private readonly _messageHandler = (event: MessageEvent): void => {
    if (!this._iframe || event.source !== this._iframe.contentWindow) {
      return;
    }

    const message = event.data as { type?: string; height?: number };
    if (message?.type !== "uriFacultyTrainingCalendar:height" || !message.height) {
      return;
    }

    const nextHeight = Math.max(720, Math.ceil(message.height));
    this._iframe.style.height = `${nextHeight}px`;
  };

  public render(): void {
    const title = this.properties.title || strings.DefaultTitle;

    this.domElement.innerHTML = `
      <section class="${styles.uriFacultyTrainingCalendar}" aria-label="${escapeAttribute(title)}">
        <iframe
          class="${styles.calendarFrame}"
          title="${escapeAttribute(title)}"
          allow="clipboard-write"
        ></iframe>
      </section>
    `;

    window.removeEventListener("message", this._messageHandler);
    window.addEventListener("message", this._messageHandler);

    this._iframe = this.domElement.querySelector("iframe") as HTMLIFrameElement;
    this._iframe.srcdoc = buildCalendarHtml();
  }

  protected onDispose(): void {
    window.removeEventListener("message", this._messageHandler);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

function escapeAttribute(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

