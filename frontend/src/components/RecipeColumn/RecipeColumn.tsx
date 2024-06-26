import {
  AccessTimeRounded,
  ClearOutlined,
  FileDownloadOutlined,
  InfoOutlined,
  Lock,
  LockOpen,
  Restaurant
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from 'react';
import LinesEllipsis from 'react-lines-ellipsis';
import { Recipe } from '../../types';
import { Clamp, ToKilo } from '../../utils/Math';
import CustomModal from '../RecipeInfoModal';
import styles from './RecipeColumn.module.css';

const MAX_CO2 = 1.8;

export interface RecipeColumnProps {
  recipe: Recipe;
  isLocked: boolean;
  onToggleLock: () => void;
}

function formatValueWithDefault(
  value: number,
  suffix: string,
  default_value: any = 'unknown'
) {
  return value === 0 ? default_value : `${value} ${suffix}`;
}

function Normalize(value: number, min: number, max: number) {
  const clampedValue = Clamp(value, min, max);
  return (clampedValue - min) / (max - min);
}

export default function RecipeColumn({
  recipe,
  isLocked,
  onToggleLock
}: RecipeColumnProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const HandleClosedModal = () => {
    setModalOpen(false);
  };

  const HandleOpenModal = () => {
    setModalOpen(true);
  };

  const getProgress = (value: number, min: number, max: number) => {
    return 100 - Normalize(value, min, max) * 100;
  };

  return (
    <article className={styles.RecipeContainer}>
      <section className={styles.RecipeImageContainer}>
        <img src={recipe.image} alt="Food" />

        <div className={styles.ImageTextOverlay}>
          <div className={styles.HoverButtonsContainer}>
            <IconButton className={styles.IconButton}>
              <ClearOutlined />
            </IconButton>
            <IconButton className={styles.IconButton}>
              <FileDownloadOutlined />
            </IconButton>
            <IconButton className={styles.IconButton} onClick={HandleOpenModal}>
              <InfoOutlined />
            </IconButton>
            <CustomModal
              open={isModalOpen}
              onClose={HandleClosedModal}
              recipe={recipe}
            >
              <div></div>
            </CustomModal>
            <IconButton className={styles.IconButton} onClick={onToggleLock}>
              {isLocked ? <Lock /> : <LockOpen />}
            </IconButton>
          </div>

          <div className={styles.IconWithText}>
            <AccessTimeRounded className={styles.Icon} />
            <p>{formatValueWithDefault(recipe.totalTime, 'min')}</p>
          </div>
          <div className={styles.IconWithText}>
            <Restaurant className={styles.Icon} />
            <p>{formatValueWithDefault(recipe.yield, 'portions')}</p>
          </div>
        </div>
      </section>

      <section className={styles.RecipeInfoContainer}>
        <header className={styles.RecipeTitleContainer}>
          <h2 className={styles.RecipeTitle}>
            <LinesEllipsis
              text={recipe.label}
              maxLine="3"
              ellipsis="..."
              trimRight
              basedOn="letters"
            />
          </h2>
        </header>
        <div className={styles.EmissionContainer}>
          <div className={styles.ProgressBar}>
            <LinearProgress
              variant="determinate"
              value={getProgress(
                ToKilo(recipe.totalCO2Emissions / recipe.yield),
                0,
                MAX_CO2
              )}
              sx={{
                background:
                  'linear-gradient(to left, #008000, #FFFF00, #FF0000)',
                '> span': { backgroundColor: 'gray' }
              }}
            />
          </div>

          <p className={styles.COtag}>
            {ToKilo(Math.trunc(recipe.totalCO2Emissions / recipe.yield))} CO
            <sub>2</sub>
          </p>
        </div>
      </section>

      <div className={styles.HoverOverlay} />
    </article>
  );
}
