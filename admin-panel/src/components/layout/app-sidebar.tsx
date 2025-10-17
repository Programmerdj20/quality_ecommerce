import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Palette,
  Settings,
  ShoppingBag,
  Store,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/use-mobile'

const navigationGroups = [
  {
    label: 'General',
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Gestión',
    items: [
      {
        name: 'Pedidos',
        href: '/orders',
        icon: Package,
      },
      {
        name: 'Productos',
        href: '/products',
        icon: Store,
        disabled: true,
      },
    ],
  },
  {
    label: 'Personalización',
    items: [
      {
        name: 'Temas',
        href: '/themes',
        icon: Palette,
      },
    ],
  },
  {
    label: 'Sistema',
    items: [
      {
        name: 'Configuración',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const { setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible={isMobile ? 'offcanvas' : 'none'}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard" onClick={handleLinkClick}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ShoppingBag className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Quality Admin</span>
                  <span className="truncate text-xs text-muted-foreground">
                    E-commerce
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild={!item.disabled}
                        isActive={isActive}
                        disabled={item.disabled}
                        tooltip={item.name}
                      >
                        {item.disabled ? (
                          <div className="flex items-center gap-2 opacity-50">
                            <Icon className="size-4" />
                            <span>{item.name}</span>
                          </div>
                        ) : (
                          <Link to={item.href} onClick={handleLinkClick} className="flex items-center gap-2">
                            <Icon className="size-4" />
                            <span>{item.name}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col gap-1 px-2 py-1 text-xs">
              <p className="truncate font-medium">{user?.email}</p>
              <p className="text-muted-foreground">v0.5.0</p>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
