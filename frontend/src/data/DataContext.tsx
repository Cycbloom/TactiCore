import React, { createContext, useContext, useState } from 'react';

interface DataContextType {
  tags: {
    data: string[];
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
  const [tags, setTags] = useState<string[]>(['工作', '学习', '生活', '重要']);

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
