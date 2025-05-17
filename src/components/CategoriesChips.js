import { ScrollView } from "react-native";
import { Chip, useTheme } from "react-native-paper";
import SkeletonLoading from "./SkeletonLoading";


const CategoriesChips = ({ categories, selectedCategory, setSelectedCategory }) => {
    const customTheme = useTheme();
    

    const ChipItem = ({ selected, value, name }) => (
        <Chip
            selected={selected}
            onPress={() => setSelectedCategory(value)}
            showSelectedCheck={false}
            style={{
                backgroundColor: selected ? customTheme.colors.primary : customTheme.colors.elevation.level1,
            }}
            selectedColor={selected ? customTheme.colors.elevation.level1 : customTheme.colors.primary}
        >
            {name}
        </Chip>
    );

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8, gap: 4 }}
        >
            <ChipItem selected={!selectedCategory} value={null} name="Все" />
            {
                categories.length === 0 ?
                    Array(4).fill(null).map((_, index) =>
                        <SkeletonLoading
                            key={`categories-skeleton-${index}`}
                            // @ts-ignore
                            skeletonWidth={80} skeletonHeight={28}
                        />
                    ) :
                    categories.map(category =>
                        <ChipItem
                            key={category.id}
                            selected={selectedCategory === category.id}
                            value={category.id}
                            name={category.name}
                        />
                    )
            }
        </ScrollView>
    )
}

export default CategoriesChips;