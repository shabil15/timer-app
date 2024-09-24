import {
  Page,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import TimerForm from "../components/TimerForm/TimerForm";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title={"Countdown Timer App"} />
      {/* <h1>Welcome to the Countdown Timer App.</h1> */}
      <TimerForm/>
    </Page>
  );
}
