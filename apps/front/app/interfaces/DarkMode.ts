export interface DarkModeProps {
    isDarkMode: boolean; // 다크 모드 활성화 상태
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>; // 상태 변경 함수
  }