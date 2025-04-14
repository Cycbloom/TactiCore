import React, { createContext, useContext, useState } from 'react';

import { Tag } from '@/types/task';

interface DataContextType {
  tags: {
    data: Tag[];
    refresh: () => void;
  };
}

const DataContext = createContext<DataContextType>({
  tags: {
    data: [],
    refresh: () => {}
  }
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: '工作', color: '#2196f3' },
    { id: '2', name: '学习', color: '#4caf50' },
    { id: '3', name: '生活', color: '#ff9800' },
    { id: '4', name: '重要', color: '#f44336' }
  ]);

  const refreshTags = () => {
    // 这里可以添加从后端获取标签的逻辑
    console.log('刷新标签数据');
  };

  return (
    <DataContext.Provider
      value={{
        tags: {
          data: tags,
          refresh: refreshTags
        }
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
