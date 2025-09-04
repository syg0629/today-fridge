import { User, Bell } from 'lucide-react';
import { Screen } from '../types';

interface WebHeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function WebHeader({ currentScreen, onNavigate }: WebHeaderProps) {
  const navItems = [
    { id: 'fridge' as Screen, label: '냉장고 관리', icon: '📦' },
    { id: 'recipe-search' as Screen, label: '레시피 검색', icon: '🔍' },
  ];

  return (
    <>
      {/* 데스크톱/태블릿 상단 헤더 */}
      <header className="hidden md:block bg-white shadow-sm border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* 로고 */}
            <div 
              onClick={() => onNavigate('fridge')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="text-2xl lg:text-3xl">🌿</div>
              <div>
                <h1 className="text-lg lg:text-xl font-semibold text-[#374151]">
                  나만의 냉장고 요리사
                </h1>
                <p className="hidden lg:block text-xs text-[#6B7280]">
                  신선한 재료로 건강한 요리를
                </p>
              </div>
            </div>

            {/* 데스크톱/태블릿 네비게이션 - 가운데 정렬 */}
            <nav className="flex items-center justify-center gap-6 lg:gap-8 flex-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-6 lg:px-8 py-2 lg:py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentScreen === item.id
                      ? 'bg-[#10B981] text-white shadow-md'
                      : 'text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* 우측 아이콘들 */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors relative">
                <Bell className="w-5 h-5 text-[#6B7280]" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EF4444] rounded-full text-xs"></span>
              </button>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors">
                <User className="w-5 h-5 text-[#6B7280]" />
                <span className="text-sm text-[#374151]">로그인</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 상단 헤더 (로고만) */}
      <header className="md:hidden bg-white shadow-sm border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div 
              onClick={() => onNavigate('fridge')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="text-xl">🌿</div>
              <h1 className="font-semibold text-[#374151]">냉장고 요리사</h1>
            </div>

            {/* 모바일 우측 아이콘 */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors relative">
                <Bell className="w-5 h-5 text-[#6B7280]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 하단 네비게이션 - 2개 메뉴 균등 분할 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50">
        <div className="grid grid-cols-2 px-2 py-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-3 px-1 rounded-lg transition-all duration-200 ${
                currentScreen === item.id
                  ? 'text-[#10B981] bg-[#F0FDF4]'
                  : 'text-[#6B7280] hover:text-[#374151] hover:bg-[#F3F4F6]'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className={`text-sm leading-tight text-center ${
                currentScreen === item.id ? 'font-semibold' : 'font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}