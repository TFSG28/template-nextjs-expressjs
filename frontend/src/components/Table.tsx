import React, { createContext, useContext } from 'react';

// Types exactos de HeroUI
type AlignType = 'start' | 'center' | 'end';
type RadiusType = 'none' | 'sm' | 'md' | 'lg';
type ShadowType = 'none' | 'sm' | 'md' | 'lg';

interface ClassNames {
    base?: string;
    wrapper?: string;
    table?: string;
    thead?: string;
    tbody?: string;
    tr?: string;
    th?: string;
    td?: string;
    tfoot?: string;
    sortIcon?: string;
    emptyWrapper?: string;
    loadingWrapper?: string;
}

interface TableProps {
    children: React.ReactNode;
    className?: string;
    classNames?: ClassNames;

    // Visual props
    radius?: RadiusType;
    shadow?: ShadowType;
    layout?: 'auto' | 'fixed';

    // Behavior props
    isStriped?: boolean;
    isCompact?: boolean;
    isHeaderSticky?: boolean;
    hideHeader?: boolean;
    fullWidth?: boolean;
    removeWrapper?: boolean;
    disableAnimation?: boolean;

    // Content props
    topContent?: React.ReactNode;
    bottomContent?: React.ReactNode;
    topContentPlacement?: 'inside' | 'outside';
    bottomContentPlacement?: 'inside' | 'outside';
}

interface TableHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface TableColumnProps {
    children: React.ReactNode;
    className?: string;
    align?: AlignType;
    allowsSorting?: boolean;
}

interface TableBodyProps {
    children?: React.ReactNode;
    className?: string;
    emptyContent?: React.ReactNode;
    isLoading?: boolean;
    loadingContent?: React.ReactNode;
}

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
}

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

// Context exacto de HeroUI
interface TableContextValue {
    slots: {
        base: string;
        wrapper: string;
        table: string;
        thead: string;
        tbody: string;
        tr: string;
        th: string;
        td: string;
        tfoot: string;
        sortIcon: string;
        emptyWrapper: string;
        loadingWrapper: string;
    };
    classNames?: ClassNames;
    state: {
        isStriped?: boolean;
        isCompact?: boolean;
        isHeaderSticky?: boolean;
        hideHeader?: boolean;
        fullWidth?: boolean;
        removeWrapper?: boolean;
        disableAnimation?: boolean;
    };
}

const TableContext = createContext<TableContextValue | null>(null);

// Utility function exacta de HeroUI con soporte para objetos condicionales
type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean | undefined };

const cn = (...classes: ClassValue[]): string => {
    const result: string[] = [];

    for (const cls of classes) {
        if (!cls) continue;

        if (typeof cls === 'string') {
            result.push(cls);
        } else if (typeof cls === 'object') {
            for (const [key, value] of Object.entries(cls)) {
                if (value) {
                    result.push(key);
                }
            }
        }
    }

    return result.join(' ');
};

// Slots exactos de HeroUI con todas las clases base
const tableSlots = {
    base: cn(
        "flex",
        "flex-col",
        "relative",
        "gap-4",
    ),
    wrapper: cn(
        "p-4",
        "z-1",
        "flex",
        "flex-col",
        "relative",
        "justify-between",
        "gap-4",
        "shadow-small",
        "bg-content1",
        "overflow-auto",
        "rounded-large",
    ),
    table: cn(
        "min-w-full",
        "h-auto",
        "table-auto",
        "w-full",
    ),
    thead: cn(
        "[&>tr]:first:rounded-lg",
    ),
    tbody: "",
    tr: cn(
        "group",
        "outline-none",
        "data-[focus-visible=true]:z-10",
        "data-[focus-visible=true]:outline-2",
        "data-[focus-visible=true]:outline-focus",
        "data-[focus-visible=true]:outline-offset-2",
    ),
    th: cn(
        "group",
        "px-3",
        "py-3",
        "h-10",
        "text-left",
        "align-middle",
        "bg-default-100",
        "text-foreground-500",
        "text-tiny",
        "font-semibold",
        "first:rounded-l-lg",
        "last:rounded-r-lg",
        "outline-none",
        "data-[sortable=true]:transition-colors",
        "data-[sortable=true]:cursor-pointer",
        "data-[hover=true]:text-foreground-400",
        "data-[focus-visible=true]:z-10",
        "data-[focus-visible=true]:outline-2",
        "data-[focus-visible=true]:outline-focus",
        "data-[focus-visible=true]:outline-offset-2",
    ),
    td: cn(
        "py-2",
        "px-3",
        "relative",
        "align-middle",
        "outline-none",
        "text-small",
        "text-foreground-600",
        "[&>*]:z-1",
        "[&>*]:relative",
        "data-[focus-visible=true]:z-10",
        "data-[focus-visible=true]:outline-2",
        "data-[focus-visible=true]:outline-focus",
        "data-[focus-visible=true]:outline-offset-2",
        "before:content-['']",
        "before:absolute",
        "before:z-0",
        "before:inset-0",
        "before:opacity-0",
        "data-[selected=true]:before:opacity-100",
        "before:bg-default/40",
        "data-[disabled=true]:text-foreground-300",
    ),
    tfoot: "",
    sortIcon: cn(
        "ml-2",
        "text-inherit",
        "opacity-0",
        "transition-opacity",
        "data-[visible=true]:opacity-100",
        "group-hover:opacity-100",
    ),
    emptyWrapper: cn(
        "text-foreground-400",
        "text-center",
        "h-40",
        "flex",
        "items-center",
        "justify-center",
    ),
    loadingWrapper: cn(
        "flex",
        "items-center",
        "justify-center",
        "h-40",
    ),
};

// Table component principal
export const Table = (props: TableProps) => {
    const {
        children,
        className,
        classNames = {},

        // Visual props
        radius = 'lg',
        shadow = 'sm',
        layout = 'auto',

        // Behavior props
        isStriped = false,
        isCompact = false,
        isHeaderSticky = false,
        hideHeader = false,
        fullWidth = true,
        removeWrapper = false,
        disableAnimation = false,

        // Content props
        topContent,
        bottomContent,
        topContentPlacement = 'inside',
        bottomContentPlacement = 'inside',
    } = props;

    // Merge de slots con classNames personalizadas
    const slots = {
        base: cn(tableSlots.base, classNames.base),
        wrapper: cn(tableSlots.wrapper, classNames.wrapper),
        table: cn(tableSlots.table, classNames.table),
        thead: cn(tableSlots.thead, classNames.thead),
        tbody: cn(tableSlots.tbody, classNames.tbody),
        tr: cn(tableSlots.tr, classNames.tr),
        th: cn(tableSlots.th, classNames.th),
        td: cn(tableSlots.td, classNames.td),
        tfoot: cn(tableSlots.tfoot, classNames.tfoot),
        sortIcon: cn(tableSlots.sortIcon, classNames.sortIcon),
        emptyWrapper: cn(tableSlots.emptyWrapper, classNames.emptyWrapper),
        loadingWrapper: cn(tableSlots.loadingWrapper, classNames.loadingWrapper),
    };

    // Estado del contexto
    const contextValue: TableContextValue = {
        slots,
        classNames,
        state: {
            isStriped,
            isCompact,
            isHeaderSticky,
            hideHeader,
            fullWidth,
            removeWrapper,
            disableAnimation,
        },
    };

    // Clases aplicadas al wrapper
    const wrapperClasses = cn(
        slots.wrapper,
        {
            'shadow-none': shadow === 'none',
            'shadow-small': shadow === 'sm',
            'shadow-medium': shadow === 'md',
            'shadow-large': shadow === 'lg',
        },
        {
            'rounded-none': radius === 'none',
            'rounded-small': radius === 'sm',
            'rounded-medium': radius === 'md',
            'rounded-large': radius === 'lg',
        },
        className
    );

    // Clases aplicadas a la tabla
    const tableClasses = cn(
        slots.table,
        {
            'table-fixed': layout === 'fixed',
            'table-auto': layout === 'auto',
        },
        {
            'w-full': fullWidth,
        }
    );

    const tableElement = (
        <table className={tableClasses}>
            {children}
        </table>
    );

    // Contexto provider
    const contextProvider = (
        <TableContext.Provider value={contextValue}>
            {tableElement}
        </TableContext.Provider>
    );

    // Si removeWrapper es true, retornar solo la tabla
    if (removeWrapper) {
        return contextProvider;
    }

    // Renderizado completo con wrapper
    return (
        <div className={cn(slots.base, className)}>
            {topContent && topContentPlacement === 'outside' && topContent}
            <div className={wrapperClasses}>
                {topContent && topContentPlacement === 'inside' && topContent}
                <TableContext.Provider value={contextValue}>
                    {tableElement}
                </TableContext.Provider>
                {bottomContent && bottomContentPlacement === 'inside' && bottomContent}
            </div>
            {bottomContent && bottomContentPlacement === 'outside' && bottomContent}
        </div>
    );
};

// TableHeader component
export const TableHeader = ({ children, className }: TableHeaderProps) => {
    const context = useContext(TableContext);
    if (!context) throw new Error('TableHeader must be used within Table');

    const { slots, state } = context;

    if (state.hideHeader) {
        return null;
    }

    const theadClasses = cn(
        slots.thead,
        {
            'sticky top-0 z-20': state.isHeaderSticky,
        },
        className
    );

    return (
        <thead className={theadClasses}>
            <tr>
                {children}
            </tr>
        </thead>
    );
};

// TableColumn component
export const TableColumn = ({
    children,
    className,
    align = 'start',
    allowsSorting = false,
}: TableColumnProps) => {
    const context = useContext(TableContext);
    if (!context) throw new Error('TableColumn must be used within Table');

    const { slots, state } = context;

    const alignClasses = {
        start: 'text-left',
        center: 'text-center',
        end: 'text-right',
    };

    const thClasses = cn(
        slots.th,
        alignClasses[align],
        {
            'px-2 py-1': state.isCompact,
        },
        {
            'cursor-pointer': allowsSorting,
        },
        className
    );

    return (
        <th
            className={thClasses}
            data-sortable={allowsSorting}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {children}
                    {allowsSorting && (
                        <svg
                            className={slots.sortIcon}
                            data-visible={false}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m7 15 5 5 5-5" />
                            <path d="m7 9 5-5 5 5" />
                        </svg>
                    )}
                </div>
            </div>
        </th>
    );
};

// TableBody component
export const TableBody = ({
    children,
    className,
    emptyContent,
    isLoading = false,
    loadingContent,
}: TableBodyProps) => {
    const context = useContext(TableContext);
    if (!context) throw new Error('TableBody must be used within Table');

    const { slots } = context;

    const tbodyClasses = cn(slots.tbody, className);

    // Estado de loading
    if (isLoading) {
        return (
            <tbody className={tbodyClasses} data-loading="true">
                <tr>
                    <td colSpan={1000}>
                        <div className={slots.loadingWrapper}>
                            {loadingContent || <div>Loading...</div>}
                        </div>
                    </td>
                </tr>
            </tbody>
        );
    }

    // Estado vacío
    const hasChildren = React.Children.count(children) > 0;

    if (!hasChildren && emptyContent) {
        return (
            <tbody className={tbodyClasses} data-empty="true">
                <tr>
                    <td colSpan={1000}>
                        <div className={slots.emptyWrapper}>
                            {emptyContent}
                        </div>
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody className={tbodyClasses}>
            {children}
        </tbody>
    );
};

// TableRow component
export const TableRow = ({ children, className }: TableRowProps) => {
    const context = useContext(TableContext);
    if (!context) throw new Error('TableRow must be used within Table');

    const { slots, state } = context;

    const trClasses = cn(
        slots.tr,
        {
            'hover:bg-default-50': !state.disableAnimation,
            'data-[odd=true]:bg-default-50': state.isStriped,
        },
        className
    );

    return (
        <tr className={trClasses}>
            {children}
        </tr>
    );
};

// TableCell component
export const TableCell = ({ children, className }: TableCellProps) => {
    const context = useContext(TableContext);
    if (!context) throw new Error('TableCell must be used within Table');

    const { slots, state } = context;

    const tdClasses = cn(
        slots.td,
        {
            'px-2 py-1': state.isCompact,
        },
        className
    );

    return (
        <td className={tdClasses}>
            {children}
        </td>
    );
};