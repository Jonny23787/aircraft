// @ts-strict-ignore
// Copyright (c) 2021-2026 FlyByWire Simulations
// SPDX-License-Identifier: GPL-3.0

import { Runway } from '@flybywiresim/fbw-sdk';
import { Keypad } from '../legacy/A320_Neo_CDU_Keypad';
import { CDUPilotsWaypoint } from './A320_Neo_CDU_PilotsWaypoint';
import { NXSystemMessages } from '../messages/NXSystemMessages';
import { LegacyFmsPageInterface } from '../legacy/LegacyFmsPageInterface';

/*
    Displays blank runway field, when runway inputted, LS IDENT, LAT, LONG, LENGTH, ELV, CRS will show.
    Derives from Data Index PG2
*/

export class CDURunwayPage {
  static ShowPage(mcdu: LegacyFmsPageInterface, runway: Runway | undefined) {
    mcdu.clearDisplay();
    mcdu.page.Current = mcdu.page.RunwayPage;
    mcdu.returnPageCallback = () => {
      CDURunwayPage.ShowPage(mcdu, runway);
    };

    let runwayValue = '_______[color]amber';
    let lsIdentLabel = '';
    let lsIdentValue = '';
    let latLongLabel = '';
    let latLongValue = '';
    let lengthLabel = '';
    let lengthValue = '';
    let elvLabel = '';
    let elvValue = '';
    let crsLabel = '';
    let crsValue = '';

    if (runway) {
      runwayValue = `${runway.ident}[color]cyan`;
      lsIdentLabel = '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0LS IDENT';
      lsIdentValue = `${runway.lsIdent}[color]green`;
      latLongLabel = '\xa0\xa0\xa0\xa0LAT/LONG';
      latLongValue = `${CDUPilotsWaypoint.formatLatLong(runway.thresholdLocation)}[color]green`; // needs verifying
      lengthLabel = '\xa0LENGTH';
      lengthValue = `${runway.length}[color]green`;
      elvLabel = '\xa0ELV';
      elvValue = `${runway.thresholdLocation.alt}[color]green`;
      crsLabel = '\xa0CRS';
      crsValue = `${runway.magneticBearing}[color]green`;
    }

    mcdu.onLeftInput[0] = (value, scratchpadCallback) => {
      if (value === Keypad.clrValue) {
        CDURunwayPage.ShowPage(mcdu, undefined);
        return;
      }

      mcdu.getOrSelectRunwayByIdent(value, (res) => {
        if (res) {
          CDURunwayPage.ShowPage(mcdu, res);
        } else {
          mcdu.setScratchpadMessage(NXSystemMessages.notAllowed);
          scratchpadCallback();
        }
      });
    };

    mcdu.setTemplate([
      ['RUNWAY'],
      ['\xa0IDENT', lsIdentLabel],
      [runwayValue, lsIdentValue],
      [latLongLabel],
      [latLongValue],
      [''],
      [''],
      [lengthLabel],
      [lengthValue],
      [elvLabel],
      [elvValue],
      [crsLabel],
      [crsValue],
    ]);
  }
}
