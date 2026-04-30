// Copyright (c) 2021-2023 FlyByWire Simulations
//
// SPDX-License-Identifier: GPL-3.0

import React from 'react';
import { useSimVar, useArinc429Var } from '@flybywiresim/fbw-sdk';

import './Door.scss';

export const DoorPage = () => {
  const [cabin] = useSimVar('INTERACTIVE POINT OPEN:0', 'percent', 1000);
  const [catering] = useSimVar('INTERACTIVE POINT OPEN:3', 'percent', 1000);
  const [cargoLocked] = useSimVar('L:A32NX_FWD_DOOR_CARGO_LOCKED', 'bool', 1000);
  const [oxygen] = useSimVar('L:PUSH_OVHD_OXYGEN_CREW', 'bool', 1000);
  const [slides] = useSimVar('L:A32NX_SLIDES_ARMED', 'bool', 1000);

  const cpc1DiscreteWord = useArinc429Var('L:A32NX_PRESS_CPC_1_DISCRETE_WORD');

  const [autoMode] = useSimVar('L:A32NX_OVHD_PRESS_MODE_SEL_PB_IS_AUTO', 'Bool', 1000);

  const activeCpcNumber = cpc1DiscreteWord.bitValueOr(11, false) ? 1 : 2;
  const arincCabinVs = useArinc429Var(`L:A32NX_PRESS_CPC_${activeCpcNumber}_CABIN_VS`, 500);
  const [manCabinVs] = useSimVar('L:A32NX_PRESS_MAN_CABIN_VS', 'feet per minute', 500);
  const cabinVs = arincCabinVs.isNormalOperation() ? arincCabinVs.value : manCabinVs;
  const [flightPhase] = useSimVar('L:A32NX_FWC_FLIGHT_PHASE', 'Enum', 1000);
  const flightPhase567 = flightPhase === 5 || flightPhase === 6 || flightPhase === 7;

  return (
    <>
      {/* This is already in an svg so we should remove the containing one - TODO remove style once we are not in the Asobo ECAM */}
      <svg id="door-page" viewBox="0 0 600 600" style={{ marginTop: '-60px' }} xmlns="http://www.w3.org/2000/svg">
        <g id="fuselage">
          <path className="MainShape" d="M 267 473 l -5 -13 l 0 -340 C 260,102 276,52 300,40" />
          <path className="MainShape" d="M 333 473 l 5 -13 l 0 -340 C 340,102 324,52 300,40" />
          <line className="MainShape" x1="262" y1="275" x2="160" y2="308" />
          <line className="MainShape" x1="338" y1="275" x2="440" y2="308" />
        </g>

        <g id="hatches">
          <path className="DoorShape" d="M292 73 l0 -9 l16 0 l0 9Z" />
          <path className="DoorShape" d="M283 102 l0 -15 l9 0 l0 15Z" />
          <path className="DoorShape" d="M317 102 l0 -15 l-9 0 l0 15Z" />

          <path className="DoorShape" d="M300 181 l0 10 l16 0 l0 -10Z" />
          <path
            id="DoorFwdCargo"
            className={cargoLocked ? 'DoorShape' : 'WarningShape'}
            d="M336 221 l0 -20 l-18 0 l0 20Z"
          />
          <path className="DoorShape" d="M336 384 l0 -20 l-18 0 l0 20Z" />
          <path className="DoorShape" d="M328 414 l0 -22 l-8 0 l0 22Z" />
        </g>

        <g id="slides">
          <path
            id="DoorFrontLeft"
            className={cabin > 20 ? 'WarningShape' : 'DoorShape'}
            d="M264 145 l0 -20 l12 0 l0 20Z"
          />
          <path className="DoorShape" d="M336 145 l0 -20 l-12 0 l0 20Z" />
          <path className="DoorShape" d="M264 310 l0 -20 l12 0 l0 20Z" />
          <path className="DoorShape" d="M336 310 l0 -20 l-12 0 l0 20Z" />
          <path className="DoorShape" d="M264 344 l0 -20 l12 0 l0 20Z" />
          <path className="DoorShape" d="M336 344 l0 -20 l-12 0 l0 20Z" />

          <path className="DoorShape" d="M264 445 l0 -20 l12 0 l0 20Z" />
          <path
            id="DoorBackRight"
            className={catering > 20 ? 'WarningShape' : 'DoorShape'}
            d="M336 445 l0 -20 l-12 0 l0 20Z"
          />
        </g>

        <g id="dashes">
          <path
            id="cabin1dash"
            className={cabin > 20 ? 'WarningShape' : 'Hide'}
            strokeDasharray="7,4"
            d="M138, 136 l121 0"
          />
          <path
            id="cabin4dash"
            className={catering > 20 ? 'WarningShape' : 'Hide'}
            strokeDasharray="7,4"
            d="M346, 438 l77 0"
          />
          <path
            id="cargo1dash"
            className={cargoLocked ? 'Hide' : 'WarningShape'}
            strokeDasharray="7,4"
            d="M346, 210 l77 0"
          />
          <g
            id="vsArrow"
            className={flightPhase567 && (cabinVs * 60 <= -50 || cabinVs * 60 >= 50) && autoMode ? '' : 'Hide'}
            transform={cabinVs * 60 <= -50 ? 'translate(0, 140) scale(1, -1)' : 'scale(1, 1)'}
          >
            <path d="M433,80 h7 L446,70" className="VsIndicator" strokeLinejoin="miter" />
            <polygon points="452,63 447,71 457,71" transform="rotate(38,452,63)" className="VsIndicator" />
          </g>
        </g>

        {/* Texts */}
        <g id="texts">
          <text
            id="PageTitle"
            className="Title"
            x="300"
            y="16"
            textAnchor="middle"
            alignmentBaseline="central"
            textDecoration="underline"
          >
            DOOR/OXY
          </text>
          <text
            id="slide1"
            className={slides ? 'Slide' : 'Hide'}
            x="232"
            y="136"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            SLIDE
          </text>
          <text
            id="slide2"
            className={slides ? 'Slide' : 'Hide'}
            x="368"
            y="136"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            SLIDE
          </text>
          <text id="slide3" className="Slide" x="232" y="320" textAnchor="middle" alignmentBaseline="central">
            SLIDE
          </text>
          <text id="slide4" className="Slide" x="368" y="320" textAnchor="middle" alignmentBaseline="central">
            SLIDE
          </text>
          <text
            id="slide5"
            className={slides ? 'Slide' : 'Hide'}
            x="232"
            y="438"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            SLIDE
          </text>
          <text
            id="slide6"
            className={slides ? 'Slide' : 'Hide'}
            x="368"
            y="438"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            SLIDE
          </text>

          <text
            id="cabin1"
            className={cabin > 20 ? 'Warning' : 'Hide'}
            x="103"
            y="136"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            CABIN
          </text>
          <text
            id="cabin4"
            className={catering > 20 ? 'Warning' : 'Hide'}
            x="455"
            y="438"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            CABIN
          </text>
          <text
            id="cargo1"
            className={cargoLocked ? 'Hide' : 'Warning'}
            x="455"
            y="211"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            CARGO
          </text>

          <text
            id="oxy"
            className={oxygen ? 'OxyWarn' : 'Oxygen'}
            x="490"
            y="18"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            CKPT OXY
          </text>

          <text id="psi_val" className="Value" x="432" y="42" textAnchor="middle" alignmentBaseline="central">
            1700
          </text>
          <text id="psi_unit" className="Unit" x="486" y="43" textAnchor="middle" alignmentBaseline="central">
            PSI
          </text>
          <text id="psi_val_right" className="Value" x="538" y="42" textAnchor="middle" alignmentBaseline="central">
            1700
          </text>

          <text
            id="cab_vs"
            x="395"
            y="80"
            className={flightPhase567 ? 'Oxygen' : 'Hide'}
            textAnchor="middle"
            alignmentBaseline="central"
          >
            V/S
          </text>
          <text id="CabinVerticalSpeed" className={flightPhase567 ? 'Value' : 'Hide'} x="500" y="86.5" textAnchor="end">
            {!autoMode ? Math.round(cabinVs / 50) * 50 : Math.abs(Math.round(cabinVs / 50) * 50)}
          </text>
          <text
            id="vs_unit"
            className={flightPhase567 ? 'Unit' : 'Hide'}
            x="550"
            y="80"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            FT/MIN
          </text>
        </g>
      </svg>
    </>
  );
};
