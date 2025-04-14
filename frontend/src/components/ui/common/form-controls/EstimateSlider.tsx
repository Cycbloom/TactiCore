// 新增 src/components/forms/EstimateSlider.tsx
import { Slider, Typography, Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';

interface EstimateSliderProps {
  name: string;
  label: string;
  max?: number;
  step?: number;
}

const EstimateSlider = ({ name, label, max = 24, step = 0.5 }: EstimateSliderProps) => {
  const { setValue, watch } = useFormContext();
  const value = watch(name) || 0;

  return (
    <Box mt={3} mb={2}>
      <Typography gutterBottom>
        {label}：{value} 小时
      </Typography>
      <Slider
        value={value}
        onChange={(_, val) => setValue(name, val)}
        min={0}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        marks={[
          { value: 0, label: '0h' },
          { value: 4, label: '4h' },
          { value: 8, label: '8h' },
          { value: 12, label: '12h' },
          { value: 24, label: '24h' }
        ]}
        sx={{
          color: '#4a90e2',
          height: 8,
          '& .MuiSlider-thumb': {
            backgroundColor: '#fff',
            border: '2px solid currentColor'
          }
        }}
      />
    </Box>
  );
};

export default EstimateSlider;
