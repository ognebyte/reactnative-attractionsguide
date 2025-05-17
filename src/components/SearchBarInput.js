import { Searchbar } from 'react-native-paper';


const SearchBarInput = ({ value, onChange, modeView = false, placeholder = "Поиск", style = {} }) => {
    return (
        <Searchbar
            mode={modeView ? 'view' : 'bar'}
            placeholder={placeholder}
            value={value}
            onChangeText={onChange}
            inputStyle={{
                minHeight: 0,
            }}
            style={[{ height: 'auto' }, style]}
        />
    );
};

export default SearchBarInput;
