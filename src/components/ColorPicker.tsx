import { SliderField } from '@decky/ui';

// Predefined color palette
const COLOR_PALETTE = [
  { name: 'Blue', color: '#4B9EEA' },
  { name: 'Green', color: '#4CAF50' },
  { name: 'Purple', color: '#9C27B0' },
  { name: 'Red', color: '#F44336' },
  { name: 'Orange', color: '#FF9800' },
  { name: 'Teal', color: '#009688' },
  { name: 'Pink', color: '#E91E63' },
  { name: 'Yellow', color: '#FFD700' },
  { name: 'Cyan', color: '#00BCD4' },
  { name: 'White', color: '#FFFFFF' },
  { name: 'Black', color: '#000000' }
];

// Helper function to find color index
const findColorIndex = (searchColor: string): number => {
  return Math.max(0, COLOR_PALETTE.findIndex(
    ({ color }) => color.toLowerCase() === searchColor.toLowerCase()
  ));
};

// Export the slider configuration
export const getColorSlider = (label: string, currentColor: string, onColorChange: (color: string) => void) => {
  const currentIndex = findColorIndex(currentColor);

  return window.SP_REACT.createElement(SliderField, {
    label: `${label}: ${COLOR_PALETTE[currentIndex].name}`,
    value: currentIndex,
    min: 0,
    max: COLOR_PALETTE.length - 1,
    step: 1,
    onChange: (value: number) => {
      onColorChange(COLOR_PALETTE[value].color);
    },
    notchCount: COLOR_PALETTE.length,
    notchLabels: [
      { notchIndex: 0, label: "" },
      { notchIndex: COLOR_PALETTE.length - 1, label: "" }
    ],
    showValue: false
  });
};