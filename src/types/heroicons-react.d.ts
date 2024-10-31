declare module '@heroicons/react/24/outline' {
    import * as React from 'react';

    // Define a generic type for HeroIconProps, to be used across icons.
    export interface HeroIconProps extends React.SVGProps<SVGSVGElement> {
        title?: string;
    }

    // Export each icon as an individual component
    export const XMarkIcon: React.FC<HeroIconProps>;
    export const SunIcon: React.FC<HeroIconProps>;
    export const MoonIcon: React.FC<HeroIconProps>;
    export const Bars3Icon: React.FC<HeroIconProps>;
    // Add other outline icons as needed.
}

declare module '@heroicons/react/24/solid' {
    import * as React from 'react';

    export interface HeroIconProps extends React.SVGProps<SVGSVGElement> {
        title?: string;
    }

    // Define solid icons only if they are used.
    // Example:
    // export const HomeIcon: React.FC<HeroIconProps>;
}
