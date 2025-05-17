import { Svg, Path, G } from 'react-native-svg';


export default iconEmptyImage = (color = '#000') => (
    <Svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="none">
        <G fill={color} clip-path="url(#a)">
            <Path d="M85 45.121 82.879 43 43 82.879 45.121 85l3-3H79a3.004 3.004 0 0 0 3-3V48.121l3-3ZM79 79H51.121l11.69-11.69 3.568 3.569a3 3 0 0 0 4.242 0L73 68.5l6 5.996V79Zm0-8.748-3.879-3.878a3 3 0 0 0-4.242 0L68.5 68.752l-3.566-3.565L79 51.12v19.131ZM49 73v-4.5l7.5-7.495 2.06 2.06 2.124-2.124-2.063-2.062a3 3 0 0 0-4.242 0L49 64.257V49h24v-3H49a3.003 3.003 0 0 0-3 3v24h3Z" />
        </G>
        <Path d="M40 40h48v48H40z" />
    </Svg>
)