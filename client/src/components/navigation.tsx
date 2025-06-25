import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Trophy, Settings } from "lucide-react";
import FlightModeLogo from "./flight-mode-logo";

export default function Navigation() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Competitions', href: '/competitions' },
    { name: 'How It Works', href: '#' },
    { name: 'Winners', href: '#' },
    { name: 'Support', href: '#' },
  ];

  const authenticatedNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Competitions', href: '/competitions' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const currentNavItems = isAuthenticated ? authenticatedNavItems : navItems;

  return (
    <nav className="bg-cream/95 navbar-blur sticky top-0 z-50 border-b border-navy-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/" className="block">
                <FlightModeLogo 
                  variant="full" 
                  theme="light"
                  className="h-10"
                />
              </a>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {currentNavItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-navy-700 hover:text-gold-500 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-spin w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || 'User'} />
                      <AvatarFallback>
                        {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/dashboard" className="flex items-center">
                      <Trophy className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/api/logout" className="flex items-center text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-navy-700 hover:text-gold-500"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-gold-500 hover:bg-gold-600 text-white"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {currentNavItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-navy-700 hover:text-gold-500 px-3 py-2 text-lg font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  <div className="border-t pt-4">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="flex items-center px-3 py-2">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || 'User'} />
                            <AvatarFallback>
                              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-navy-900 font-medium">
                            {user?.firstName || user?.email || 'User'}
                          </span>
                        </div>
                        <a
                          href="/dashboard"
                          className="flex items-center text-navy-700 hover:text-gold-500 px-3 py-2 text-lg font-medium transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <Trophy className="mr-2 h-5 w-5" />
                          Dashboard
                        </a>
                        <a
                          href="/api/logout"
                          className="flex items-center text-red-600 hover:text-red-700 px-3 py-2 text-lg font-medium transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <LogOut className="mr-2 h-5 w-5" />
                          Log out
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-navy-700 hover:text-gold-500"
                          onClick={() => {
                            setIsOpen(false);
                            window.location.href = '/api/login';
                          }}
                        >
                          Sign In
                        </Button>
                        <Button
                          className="w-full bg-gold-500 hover:bg-gold-600 text-white"
                          onClick={() => {
                            setIsOpen(false);
                            window.location.href = '/api/login';
                          }}
                        >
                          Get Started
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
