import { Pie } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Expressions {
  [key: string]: number;
}

interface ExpressionsChartProps {
  expressions: Expressions;
  video: string;
}

const initialAverage = {
  "neutral": 0,
  "happy": 0,
  "sad": 0,
  "angry": 0,
  "fearful": 0,
  "disgusted": 0,
  "surprised": 0
}

export const ExpressionsChart: React.FC<ExpressionsChartProps> = ({ expressions, video }) => {
  const [averageExpressions, setAverageExpressions] = useState<Expressions>(initialAverage);
  const [count, setCount] = useState(1);

  useEffect(() => {
    const newAverageExpressions: Expressions = {...averageExpressions};
    for (let expression in expressions) {
      newAverageExpressions[expression] = ((newAverageExpressions[expression] * (count - 1)) + expressions[expression]) / count;
    }
    setAverageExpressions(newAverageExpressions);
    setCount(count + 1);
  }, [expressions]);

  // Añade este useEffect para reiniciar los estados cuando cambia el video
  useEffect(() => {
    setAverageExpressions(initialAverage);
    setCount(1);
  }, [video]);

  const data = {
    labels: Object.keys(averageExpressions),
    datasets: [
      {
        data: Object.values(averageExpressions),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#800000',
          '#008080',
          '#800080',    
          '#FF4500'
        ]
      }
    ]
  };

  return (
    <div>
      <Pie data={data} />
    </div>
  );
};
