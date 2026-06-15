import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '@services/state.service';

@Component({
  selector: 'app-web3-connect-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './web3-connect-prompt.component.html'
})
export class Web3ConnectPromptComponent {
  public readonly stateService = inject(StateService);

  @Input() title: string = 'Kết nối ví Web3';
  @Input() description: string = 'Để xem thông tin và thực hiện các thao tác quản lý của cửa hàng trên Blockchain, vui lòng kết nối ví Metamask để xác thực quyền truy cập.';
  @Input() showButton: boolean = true;
  @Input() buttonText: string = 'KẾT NỐI VÍ BLOCKCHAIN';
}
