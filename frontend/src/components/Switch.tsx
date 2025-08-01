import React from 'react';

interface SwitchProps {
    isSelected: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    color?: 'success' | 'primary' | 'secondary' | 'warning' | 'danger';
}

const Switch: React.FC<SwitchProps> = ({
    isSelected,
    onValueChange,
    disabled = false,
    size = 'md',
    color = 'success'
}) => {
    const sizeClasses = {
        sm: 'w-8 h-4',
        md: 'w-10 h-5',
        lg: 'w-12 h-6'
    };

    const thumbSizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const colorClasses = {
        success: 'bg-green-500',
        primary: 'bg-blue-500',
        secondary: 'bg-gray-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500'
    };

    const handleClick = () => {
        if (!disabled) {
            onValueChange(!isSelected);
        }
    };

    return (
        <div
            className={`
                relative inline-flex items-center cursor-pointer
                ${sizeClasses[size]}
                ${isSelected ? colorClasses[color] : 'bg-gray-300'}
                rounded-full transition-colors duration-200 ease-in-out
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={handleClick}
        >
            <div
                className={`
                    ${thumbSizeClasses[size]}
                    bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
                    ${isSelected ? 'translate-x-full' : 'translate-x-0'}
                `}
                style={{
                    transform: isSelected
                        ? `translateX(${size === 'sm' ? '8px' : size === 'md' ? '8px' : '8px'})`
                        : 'translateX(2px)'
                }}
            />
        </div>
    );
};

export default Switch;