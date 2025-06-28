import { FSComponent, VNode } from '@microsoft/msfs-sdk';
import { DestroyableComponent } from 'instruments/src/MsfsAvionicsCommon/DestroyableComponent';

import { PageTitle } from './Generic/PageTitle';

import '../../../index.scss';
import { SdPageProps } from '../SD';

export class CbPage extends DestroyableComponent<SdPageProps> {
  private readonly topSvgStyle = this.props.visible.map((v) => `visibility: ${v ? 'visible' : 'hidden'}`);

  onAfterRender(node: VNode): void {
    super.onAfterRender(node);

    this.subscriptions.push(this.topSvgStyle);
  }

  destroy(): void {
    super.destroy();
  }
  render() {
    return (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 768 1024"
        style={this.topSvgStyle}
      >
        <PageTitle x={6} y={29}>
          C/B
        </PageTitle>
      </svg>
    );
  }
}
