import {
  Page,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title={"Countdown Timer App"} />
    </Page>
  );
}
