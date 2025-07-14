import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { PRIMARY_900, COLOR_WHITE } from '@/constants/colors';

type CustomCheckboxProps = {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
};

export default function CustomCheckbox({ checked: defaultChecked = false, onChange }: CustomCheckboxProps) {
    const [checked, setChecked] = useState(defaultChecked);

    const toggle = () => {
        setChecked(prev => !prev);
        if (onChange) onChange(!checked);
    };

    return (
        <Pressable onPress={toggle}>
            {checked ? (
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path
                        d="M0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8V16C24 20.4183 20.4183 24 16 24H8C3.58172 24 0 20.4183 0 16V8Z"
                        fill={PRIMARY_900}
                    />
                    <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.0604 7.93934C18.6462 8.52513 18.6462 9.47487 18.0604 10.0607L12.0604 16.0607C11.4746 16.6464 10.5249 16.6464 9.9391 16.0607L6.9391 13.0607C6.35331 12.4749 6.35331 11.5251 6.9391 10.9393C7.52488 10.3536 8.47463 10.3536 9.06042 10.9393L10.9998 12.8787L15.9391 7.93934C16.5249 7.35355 17.4746 7.35355 18.0604 7.93934Z"
                        fill={COLOR_WHITE}
                    />
                </Svg>
            ) : (
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 3H8C5.23858 3 3 5.23858 3 8V16C3 18.7614 5.23858 21 8 21H16C18.7614 21 21 18.7614 21 16V8C21 5.23858 18.7614 3 16 3ZM8 0C3.58172 0 0 3.58172 0 8V16C0 20.4183 3.58172 24 8 24H16C20.4183 24 24 20.4183 24 16V8C24 3.58172 20.4183 0 16 0H8Z"
                        fill={PRIMARY_900}
                    />
                </Svg>
            )}
        </Pressable>
    );
}
