import {StyleSheet, Text, type TextProps} from 'react-native';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    style?: any;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'custom' | 'labels' | 'customText';
};

export function ThemedText({
                               style,
                               lightColor,
                               darkColor,
                               className,
                               type = 'default',
                               ...rest
                           }: ThemedTextProps  & { className?: string }) {
    return (
        <Text
            className={className}
            style={[
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                type === 'custom' ? styles.custom : undefined,
                type === 'labels' ? styles.labels : undefined,
                type === 'customText' && undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 18,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
    },
    custom: {
        fontSize: 40,
        fontWeight: 'bold',
        lineHeight: 64,
    },
    labels: {
        fontSize: 16,
        fontWeight: "bold",
    }
});
