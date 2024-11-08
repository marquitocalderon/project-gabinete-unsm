import { Component, EventEmitter, Output } from '@angular/core';
import { PostfacultadesComponent } from './postfacultades/postfacultades.component';
import { ApipeticionesService } from '../../core/servicios/apipeticiones.service';
import { PutfacultadesComponent } from "./putfacultades/putfacultades.component";
import { TokensService } from '../../core/auth/tokens.service';
import { EstadoGlobalGuardarDatosService } from '../../core/guardardatos/estado-global-guardar-datos.service';
import { initFlowbite } from 'flowbite';
import { HistorialbackupfacultadesComponent } from './historialbackupfacultades/historialbackupfacultades.component';

@Component({
  selector: 'app-facultades',
  standalone: true,
  imports: [PostfacultadesComponent, PutfacultadesComponent, HistorialbackupfacultadesComponent],
  templateUrl: './facultades.component.html',
  styleUrl: './facultades.component.css'
})
export class FacultadesComponent {
  constructor(private apiservicios: ApipeticionesService, private serviciosglobal: EstadoGlobalGuardarDatosService) { }
  urlArchivoasver: string = import.meta.env.NG_APP_API + '/file/imagen_facultad/';
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getdata();
    initFlowbite();
  }

  showModal: boolean = false;

  mostrarModal(datos: any){

    this.showModal = true;

    console.log(datos);

    this.serviciosglobal.setDatosServicioGlobal(datos);

  }

  recibirEstadoModal(event: boolean){
    this.showModal = event;
  }


  valor: string = ''; // Define el tipo como string
datos: any[] = [];
datosFiltrados: any[] = []; // Para almacenar los resultados filtrados
changeBuscador(event: any) {
  this.valor = event.target.value.trim(); // Elimina espacios en blanco

  // Filtra los datos según el valor ingresado
  this.datosFiltrados = this.datos.filter(item => {
    const nombreGabinete = item.nombre_gabinete ? item.nombre_gabinete.toLowerCase() : '';
    const facultad = item.facultades && item.facultades.facultad ? item.facultades.facultad.toLowerCase() : '';

    return nombreGabinete.includes(this.valor.toLowerCase()) || facultad.includes(this.valor.toLowerCase());
  });
}


getdata() {
  const url = import.meta.env.NG_APP_API + '/facultades';
  this.apiservicios.getApi(url).subscribe({
    next: (data: any) => {
      console.log(data);
      this.datos = data;
      this.datosFiltrados = data; // Inicializa los datos filtrados con los datos originales
    },
    error: (error: any) => {
      console.log(error);
    }
  });
}

abriModalPut: boolean = false;

seleccionarOpcion(event: any, datos: any) {
  console.log(event.target.value);
  if (event.target.value === 'editar') {
    this.abriModalPut = true;
    this.serviciosglobal.setDatosServicioGlobal(datos);
  } else {
   this.abriModalPut = false;
  }
}

recibirEstadoModal4(event: boolean) {
  this.abriModalPut = event;
  console.log(event);
  
  // Llamar a la función para reiniciar todos los selects si se recibe un true
  if (!event) {
    this.reiniciarSelects();
  }
}

reiniciarSelects() {
  // Seleccionar todos los elementos select en el DOM
  const selects = document.querySelectorAll('select[id^="opciones"]');

  // Restablecer cada select al valor por defecto (Opciones)
  selects.forEach((select:any) => {
    select.value = ""; // Reiniciar al valor por defecto
  });
}



}