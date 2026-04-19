"use client";

import { useState, useEffect, useRef } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EmailIcon from "@mui/icons-material/Email";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MonitorOutlinedIcon from "@mui/icons-material/MonitorOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import { useThemeMode } from "../theme/ThemeRegistry";

// ─── Types ─────────────────────────────────────────────────────────────────────

type DropdownId = "products" | "resources" | "user" | null;

// ─── Dropdown ──────────────────────────────────────────────────────────────────

interface DropdownProps {
  id: DropdownId;
  openId: DropdownId;
  onToggle: (id: DropdownId) => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  width?: string;
}

function Dropdown({ id, openId, onToggle, trigger, children, align = "left", width = "w-52" }: DropdownProps) {
  const isOpen = openId === id;
  return (
    <div className="relative">
      <button
        onClick={() => onToggle(id)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${
          isOpen
            ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        }`}
      >
        {trigger}
      </button>
      <div
        className={`absolute top-full mt-1.5 ${width} bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1.5 z-50 transition-all duration-150 origin-top ${
          align === "right" ? "right-0" : "left-0"
        } ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}
      >
        {children}
      </div>
    </div>
  );
}

// ─── DropdownItem ──────────────────────────────────────────────────────────────

interface DropdownItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  danger?: boolean;
  onClick?: () => void;
}

function DropdownItem({ icon, label, badge, danger, onClick }: DropdownItemProps) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-100 ${
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      }`}
    >
      <span className="opacity-60 shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
          {badge}
        </span>
      )}
    </a>
  );
}

// ─── NavLink ───────────────────────────────────────────────────────────────────

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
  onClick?: () => void;
}

function NavLink({ icon, label, badge, active, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${
        active
          ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      }`}
    >
      <span className="opacity-70">{icon}</span>
      {label}
      {badge && (
        <span className="ml-1 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("home");
  const [searchFocused, setSearchFocused] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // swap to true once auth is wired
  const navRef = useRef<HTMLDivElement>(null);
  const { mode, toggleTheme } = useThemeMode();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function toggleDropdown(id: DropdownId) {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }

  function handleNavClick(id: string) {
    setActiveNav(id);
    setOpenDropdown(null);
    setMobileOpen(false);
  }

  function toggleMobileSection(id: string) {
    setMobileExpanded((prev) => (prev === id ? null : id));
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setOpenDropdown(null);
  }

  const resourceItems = [
    {
      icon: <MenuBookOutlinedIcon fontSize="small" />,
      label: "Docs",
      sub: "Technical docs",
      bg: "bg-blue-50 dark:bg-blue-950",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <OndemandVideoOutlinedIcon fontSize="small" />,
      label: "Tutorials",
      sub: "Step-by-step guides",
      bg: "bg-purple-50 dark:bg-purple-950",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: <EditOutlinedIcon fontSize="small" />,
      label: "Blog",
      sub: "Latest updates",
      bg: "bg-green-50 dark:bg-green-950",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: <HeadsetMicOutlinedIcon fontSize="small" />,
      label: "Support",
      sub: "Help center",
      bg: "bg-red-50 dark:bg-red-950",
      color: "text-red-500 dark:text-red-400",
    },
  ];

  return (
    <div ref={navRef}>
      <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-14 gap-2">
            {/* Brand */}
            <a href="#" className="flex items-center gap-2 shrink-0 group mr-2">
              <div className="w-8 h-8 bg-blue-600 group-hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-colors duration-200">
                <ViewInArOutlinedIcon fontSize="small" />
              </div>
              <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                AcmePro
              </span>
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-0.5 flex-1">
              <NavLink
                icon={<HomeOutlinedIcon fontSize="small" />}
                label="Home"
                active={activeNav === "home"}
                onClick={() => handleNavClick("home")}
              />

              <Dropdown
                id="products"
                openId={openDropdown}
                onToggle={toggleDropdown}
                trigger={
                  <>
                    <span className="opacity-70">
                      <WorkOutlineOutlinedIcon fontSize="small" />
                    </span>
                    Products
                    <KeyboardArrowDownIcon
                      fontSize="small"
                      className={`transition-transform duration-200 ${openDropdown === "products" ? "rotate-180" : ""}`}
                    />
                  </>
                }
              >
                <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  Solutions
                </div>
                <DropdownItem icon={<MonitorOutlinedIcon fontSize="small" />} label="Software suite" />
                <DropdownItem icon={<StorageOutlinedIcon fontSize="small" />} label="Cloud services" />
                <DropdownItem icon={<PhoneAndroidOutlinedIcon fontSize="small" />} label="Mobile apps" />
                <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                <DropdownItem icon={<StarBorderOutlinedIcon fontSize="small" />} label="Featured products" />
              </Dropdown>

              <NavLink
                icon={<BusinessOutlinedIcon fontSize="small" />}
                label="Company"
                active={activeNav === "company"}
                onClick={() => handleNavClick("company")}
              />

              <Dropdown
                id="resources"
                openId={openDropdown}
                onToggle={toggleDropdown}
                width="w-72"
                trigger={
                  <>
                    <span className="opacity-70">
                      <DescriptionOutlinedIcon fontSize="small" />
                    </span>
                    Resources
                    <KeyboardArrowDownIcon
                      fontSize="small"
                      className={`transition-transform duration-200 ${openDropdown === "resources" ? "rotate-180" : ""}`}
                    />
                  </>
                }
              >
                <div className="grid grid-cols-2 gap-1">
                  {resourceItems.map(({ icon, label, sub, bg, color }) => (
                    <a
                      key={label}
                      href="#"
                      className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-100"
                    >
                      <div className={`${bg} ${color} w-8 h-8 rounded-lg flex items-center justify-center shrink-0`}>
                        {icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </Dropdown>

              <NavLink
                icon={<EmailIcon fontSize="small" />}
                label="Contact"
                badge="New"
                active={activeNav === "contact"}
                onClick={() => handleNavClick("contact")}
              />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search input */}
              <div
                className={`hidden md:flex items-center gap-2 px-3 h-8 rounded-lg border transition-all duration-200 ${
                  searchFocused
                    ? "border-blue-500 bg-white dark:bg-gray-900 w-48"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 w-32"
                }`}
              >
                <SearchIcon fontSize="small" className="text-gray-400 shrink-0" style={{ fontSize: 16 }} />
                <input
                  type="text"
                  placeholder="Search..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
                />
              </div>

              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                aria-label="Toggle dark mode"
              >
                {mode === "dark" ? (
                  <LightModeOutlinedIcon style={{ fontSize: 18 }} />
                ) : (
                  <DarkModeOutlinedIcon style={{ fontSize: 18 }} />
                )}
              </button>

              {/* Notifications — only when logged in */}
              {isLoggedIn && (
                <button className="relative w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-150">
                  <NotificationsNoneOutlinedIcon style={{ fontSize: 18 }} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-950" />
                </button>
              )}

              <div className="hidden md:block w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />

              {/* Auth area */}
              {isLoggedIn ? (
                <Dropdown
                  id="user"
                  openId={openDropdown}
                  onToggle={toggleDropdown}
                  align="right"
                  width="w-60"
                  trigger={
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                          JD
                        </div>
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-gray-950" />
                      </div>
                      <div className="hidden lg:block text-left">
                        <div className="text-[13px] font-medium text-gray-800 dark:text-gray-200 leading-tight">
                          John Doe
                        </div>
                        <div className="text-[11px] text-gray-400">Admin</div>
                      </div>
                      <span className="hidden lg:block">
                        <KeyboardArrowDownIcon
                          fontSize="small"
                          className={`transition-transform duration-200 ${openDropdown === "user" ? "rotate-180" : ""}`}
                        />
                      </span>
                    </div>
                  }
                >
                  <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-100 dark:border-gray-800 mb-1">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-semibold text-blue-700 dark:text-blue-300 shrink-0">
                      JD
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</div>
                      <div className="text-[11px] text-gray-400">john@example.com</div>
                    </div>
                  </div>
                  <DropdownItem icon={<PersonOutlineOutlinedIcon fontSize="small" />} label="My profile" />
                  <DropdownItem icon={<SettingsOutlinedIcon fontSize="small" />} label="Account settings" />
                  <DropdownItem icon={<EmailIcon fontSize="small" />} label="Messages" badge="3" />
                  <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                  <DropdownItem
                    icon={<LogoutOutlinedIcon fontSize="small" />}
                    label="Sign out"
                    danger
                    onClick={handleLogout}
                  />
                </Dropdown>
              ) : (
                <button
                  onClick={() => setIsLoggedIn(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150"
                >
                  <LoginOutlinedIcon style={{ fontSize: 16 }} />
                  Login
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 ml-1"
                onClick={() => setMobileOpen((p) => !p)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 dark:border-gray-800 ${
            mobileOpen ? "max-h-175 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-3 py-3 space-y-0.5 bg-white dark:bg-gray-950">
            {/* Mobile search */}
            <div className="flex items-center gap-2 px-3 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-2">
              <SearchIcon style={{ fontSize: 16 }} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none w-full"
              />
            </div>

            <a
              href="#"
              onClick={() => handleNavClick("home")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100 ${
                activeNav === "home"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <HomeOutlinedIcon fontSize="small" className="opacity-60" />
              Home
            </a>

            {/* Products collapsible */}
            <div>
              <button
                onClick={() => toggleMobileSection("products")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100"
              >
                <div className="flex items-center gap-3">
                  <WorkOutlineOutlinedIcon fontSize="small" className="opacity-60" />
                  Products
                </div>
                <KeyboardArrowDownIcon
                  fontSize="small"
                  className={`transition-transform duration-200 ${mobileExpanded === "products" ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 pl-4 ${mobileExpanded === "products" ? "max-h-48 mt-0.5" : "max-h-0"}`}
              >
                {[
                  { icon: <MonitorOutlinedIcon fontSize="small" />, label: "Software suite" },
                  { icon: <StorageOutlinedIcon fontSize="small" />, label: "Cloud services" },
                  { icon: <PhoneAndroidOutlinedIcon fontSize="small" />, label: "Mobile apps" },
                  { icon: <StarBorderOutlinedIcon fontSize="small" />, label: "Featured products" },
                ].map(({ icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-100"
                  >
                    <span className="opacity-50">{icon}</span>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="#"
              onClick={() => handleNavClick("company")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100 ${
                activeNav === "company"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <BusinessOutlinedIcon fontSize="small" className="opacity-60" />
              Company
            </a>

            {/* Resources collapsible */}
            <div>
              <button
                onClick={() => toggleMobileSection("resources")}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100"
              >
                <div className="flex items-center gap-3">
                  <DescriptionOutlinedIcon fontSize="small" className="opacity-60" />
                  Resources
                </div>
                <KeyboardArrowDownIcon
                  fontSize="small"
                  className={`transition-transform duration-200 ${mobileExpanded === "resources" ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 pl-4 ${mobileExpanded === "resources" ? "max-h-48 mt-0.5" : "max-h-0"}`}
              >
                {[
                  { icon: <MenuBookOutlinedIcon fontSize="small" />, label: "Documentation" },
                  { icon: <OndemandVideoOutlinedIcon fontSize="small" />, label: "Tutorials" },
                  { icon: <EditOutlinedIcon fontSize="small" />, label: "Blog" },
                  { icon: <HeadsetMicOutlinedIcon fontSize="small" />, label: "Support" },
                ].map(({ icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-100"
                  >
                    <span className="opacity-50">{icon}</span>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <a
              href="#"
              onClick={() => handleNavClick("contact")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-100 ${
                activeNav === "contact"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <EmailIcon fontSize="small" className="opacity-60" />
              Contact
              <span className="ml-1 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
                New
              </span>
            </a>

            {/* Auth section mobile */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2 mt-2 space-y-0.5">
              {isLoggedIn ? (
                <>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100"
                  >
                    <PersonOutlineOutlinedIcon fontSize="small" className="opacity-60" />
                    My profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-100"
                  >
                    <SettingsOutlinedIcon fontSize="small" className="opacity-60" />
                    Account settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors duration-100"
                  >
                    <LogoutOutlinedIcon fontSize="small" className="opacity-60" />
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoggedIn(true);
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150"
                >
                  <LoginOutlinedIcon fontSize="small" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
