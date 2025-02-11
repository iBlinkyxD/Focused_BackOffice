import React from 'react';
import StepNavStyle from './StepNav.module.css';

export default function StepNav({ step }) {
  return (
    <div className={StepNavStyle.progress_Container}>
      <div className={`${step >= 1 ? StepNavStyle.circle_completed : StepNavStyle.circle}`}>
        1
      </div>
      <div className={`${step >= 1 ? StepNavStyle.line_completed : StepNavStyle.line}`}></div>
      <div className={`${step >= 2 ? StepNavStyle.circle_completed : StepNavStyle.circle}`}>
        2
      </div>
      <div className={`${step >= 2 ? StepNavStyle.line_completed : StepNavStyle.line}`}></div>
      <div className={`${step >= 3 ? StepNavStyle.circle_completed : StepNavStyle.circle}`}>
        3
      </div>
      {/* <div className={`${step >= 3 ? StepNavStyle.line_completed : StepNavStyle.line}`}></div>
      <div className={`${step >= 4 ? StepNavStyle.circle_completed : StepNavStyle.circle}`}>
        4
      </div> */}
    </div>
  );
}
