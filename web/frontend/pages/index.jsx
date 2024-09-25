import React, { useState } from 'react';
import { Page, Tabs, Button } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import TimerForm from "../components/TimerForm/TimerForm";
import TimerList from "../components/TimerList/TimerList";
import { PlusIcon, ClockIcon } from '@shopify/polaris-icons';
export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { 
      id: 'new-timer',
      content: (
        <span>
          <PlusIcon style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          Add Timer
        </span>
      ),
      panelID: 'new-timer-content',
    },
    {
      id: 'timers',
      content: (
        <span>
          <ClockIcon style={{ width: '16px', height: '16px', marginRight: '4px' }} />
          Timers
        </span>
      ),
      panelID: 'timers-content',
    },
  ];

  return (
    <Page narrowWidth>
      <TitleBar title={"Countdown Timer App"} />
      <Tabs
        tabs={tabs}
        selected={selectedTab}
        onSelect={setSelectedTab}
        fitted
      />
      <div>
        {selectedTab === 0 && <TimerForm />}
        {selectedTab === 1 && <TimerList/>}
      </div>
    </Page>
  );
}
