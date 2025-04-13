import React, { ReactNode, useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabViewProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  children: ReactNode[];
  className?: string;
}

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  defaultActiveTab,
  onChange,
  children,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab || tabs[0]?.id || '');

  // Ensure we have the correct number of children
  if (!Array.isArray(children) || children.length !== tabs.length) {
    console.error('TabView: Number of children must match number of tabs');
    return null;
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  // Find the index of the active tab
  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className={`tab-view ${className}`}>
      {/* Tab Header */}
      <div className="flex border-b border-zinc-700 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium text-sm transition-colors duration-200 border-b-2 ${
              activeTab === tab.id
                ? 'text-purple-300 border-purple-500'
                : 'text-zinc-400 border-transparent hover:text-white hover:border-zinc-500'
            }`}
            onClick={() => handleTabChange(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Only render the active tab's content */}
        {activeTabIndex >= 0 && (
          <div 
            className="transition-opacity duration-300"
            role="tabpanel"
          >
            {children[activeTabIndex]}
          </div>
        )}
      </div>
    </div>
  );
};
