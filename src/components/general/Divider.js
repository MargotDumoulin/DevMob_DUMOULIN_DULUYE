import { Text, View } from "react-native";

export const Divider = ({ text, width }) => {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 20,
            }}
        >
            <View
                style={{ flex: 1, height: 1, backgroundColor: "lightgray" }}
            />
            <View>
                <Text
                    style={{
                        width: Number(width),
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    {text}
                </Text>
            </View>
            <View
                style={{ flex: 1, height: 1, backgroundColor: "lightgray" }}
            />
        </View>
    );
};
