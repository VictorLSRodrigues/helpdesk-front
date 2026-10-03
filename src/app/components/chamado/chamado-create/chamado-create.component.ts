import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';
@Component({
  selector: 'app-chamado-create',
  templateUrl: './chamado-create.component.html',
  styleUrls: ['./chamado-create.component.css']
})
export class ChamadoCreateComponent implements OnInit {

  chamado: Chamado = {
    prioridade:  '',
    status:      '',
    titulo:      '',
    observacoes: '',
    tecnico:     '',
    cliente:     '',
    nomeCliente: '',
    nomeTecnico: '',
  }

  
  clientes: Cliente[] = []
  tecnicos: Tecnico[] = []

  tecnicosFiltrados: Tecnico[] = [];

  prioridade: FormControl = new FormControl(null, [Validators.required]);
  status:     FormControl = new FormControl(null, [Validators.required]);
  titulo:     FormControl = new FormControl(null, [Validators.required]);
  observacoes:FormControl = new FormControl(null, [Validators.required]);
  tecnico:    FormControl = new FormControl(null, [Validators.required]);
  cliente:    FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toastService:    ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.findAllClientes();
    this.findAllTecnicos();
  }

@ViewChild('selectTecnico') selectTecnico: MatSelect;
abrirFiltroTecnico(aberto: boolean) {
  if (aberto) {

    const painelCliente = this.selectTecnico.panel.nativeElement;

    const input = document.createElement('input');

    input.placeholder = 'Buscar por nome...';
    input.type = 'text';

    input.addEventListener('input', () => {
      const texto = input.value.toLowerCase();

      this.tecnicosFiltrados = this.tecnicos.filter(tec =>
        tec.nome.toLowerCase().includes(texto)
      );
    });

    painelCliente.prepend(input);
  }
}

@ViewChild('selectCliente') selectCliente: MatSelect;
abrirFiltroCliente(abertoCliente: boolean) {
  if (abertoCliente) {

    const painel = this.selectCliente.panel.nativeElement;

    const input = document.createElement('input');

    input.placeholder = 'Buscar por nome...';
    input.type = 'text';

    input.addEventListener('input', () => {
      const texto = input.value.toLowerCase();

      this.tecnicosFiltrados = this.tecnicos.filter(tec =>
        tec.nome.toLowerCase().includes(texto)
      );
    });

    painel.prepend(input);
    }
  }

  
  findAllClientes(): void {
    this.clienteService.findAll().subscribe(resposta => {
      this.clientes = resposta;
    })
  }

  findAllTecnicos(): void {
    this.tecnicoService.findAll().subscribe(resposta => {
      this.tecnicos = resposta;
    })
  }

  create(): void {
    this.chamadoService.create(this.chamado).subscribe(resposta => {
      this.toastService.success('Chamado criado com sucesso', 'Novo chamado');
      this.router.navigate(['chamados']);
    }, ex => {
      console.log(ex);
      
      this.toastService.error(ex.error.error);
    })
  }

  validaCampos(): boolean {
    return this.prioridade.valid && this.status.valid && this.titulo.valid 
       && this.observacoes.valid && this.tecnico.valid && this.cliente.valid
  }

}
