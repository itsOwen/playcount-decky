/**
 * ColorPicker component - color selection slider for settings
 */

import { SliderField } from '@decky/ui';
import { COLOR_PALETTE } from '../constants';

/**
 * Find the index of a color in the palette
 */
const findColorIndex = (searchColor: string): number => {
  const index = COLOR_PALETTE.findIndex(
    ({ color }) => color.toLowerCase() === searchColor.toLowerCase()
  );
  return Math.max(0, index);
};

/**
 * Get a color slider element for settings
 * @param label - Label for the slider
 * @param currentColor - Currently selected color
 * @param onColorChange - Callback when color changes
 * @returns React element for color slider
 */
export const getColorSlider = (
  label: string,
  currentColor: string,
  onColorChange: (color: string) => void
): JSX.Element => {
  const currentIndex = findColorIndex(currentColor);
  const currentColorName = COLOR_PALETTE[currentIndex]?.name || 'Unknown';

  return window.SP_REACT.createElement(SliderField, {
    label: `${label}: ${currentColorName}`,
    value: currentIndex,
    min: 0,
    max: COLOR_PALETTE.length - 1,
    step: 1,
    onChange: (value: number) => {
      const selectedColor = COLOR_PALETTE[value];
      if (selectedColor) {
        onColorChange(selectedColor.color);
      }
    },
    notchCount: COLOR_PALETTE.length,
    notchLabels: [
      { notchIndex: 0, label: '' },
      { notchIndex: COLOR_PALETTE.length - 1, label: '' },
    ],
    showValue: false,
  });
};

export default getColorSlider;
