import { FuseNavigation } from '@fuse/types';
import { routesData } from 'app/routes';

export const navigation: FuseNavigation[] = [
    {
        id       : 'home',
        title    : 'Inicio',
        translate: 'NAV.HOME.TITLE',
        type     : 'item',
        icon     : 'home',
        url      : `/${routesData.home.root}`
    },
    {
        id         : 'files',
        title      : 'Expedientes GENAV',
        translate  : 'NAV.FILES.TITLE',
        description: 'NAV.FILES.DESCRIPTION',
        type       : 'collapsable',
        roles      : [ 'Admin', 'FilesSupervisor', 'FilesViewer' ],
        icon       : 'folder_open',
        customIcon : 'assets/icons/essential/Logo_iconos-03.png',
        goToUrl    : `/${routesData.files.root}`,
        children   : [
            {
                id       : 'create',
                title    : 'Crear expediente',
                translate: 'NAV.FILES.CREATE',
                type     : 'item',
                url      : `/${routesData.files.root}/${routesData.files.create}`,
                icon     : 'add',
                customIcon : 'assets/icons/essential/Creacion_expediente.png',
                roles    : [ 'Admin', 'FilesSupervisor' ]
            },
            {
                id       : 'query',
                title    : 'Consultar',
                translate: 'NAV.FILES.QUERY',
                type     : 'item',
                url      : `/${routesData.files.root}/${routesData.files.query}`,
                icon     : 'search',
                customIcon : 'assets/icons/essential/Consulta_expediente.png',
                roles    : [ 'Admin', 'FilesSupervisor', 'FilesViewer' ]
            },
            {
                id       : 'reports',
                title    : 'Reportes',
                translate: 'NAV.FILES.REPORTS',
                type     : 'item',
                url      : `/${routesData.files.root}/${routesData.files.reports}`,
                icon     : 'list_all',
                customIcon : 'assets/icons/essential/Reporte_expediente.png',
                roles    : [ 'Admin', 'FilesSupervisor', 'FilesViewer' ]
            }
        ]
    },
    {
        id       : 'inspections',
        title    : 'Inspecciones GENAV',
        translate: 'NAV.INSPECTIONS.TITLE',
        description: 'NAV.INSPECTIONS.DESCRIPTION',
        type     : 'collapsable',
        roles    : [ 'Admin', 'InspectorsSupervisor', 'Inspector' ],
        icon     : 'remove_red_eye',
        customIcon : 'assets/icons/essential/Logo_iconos-04.png',
        goToUrl  : `/${routesData.inspections.root}`,
        children : [
            {
                id       : 'query',
                title    : 'Consultar',
                translate: 'NAV.INSPECTIONS.QUERY',
                type     : 'item',
                url      : `/${routesData.inspections.root}/${routesData.inspections.query}`,
                icon     : 'search',
                customIcon : 'assets/icons/essential/listado_solicitudes.png',
                roles    : [ 'Admin', 'InspectorsSupervisor', 'Inspector' ]
            },
            {
                id       : 'reports',
                title    : 'Reportes',
                translate: 'NAV.INSPECTIONS.REPORTS',
                type     : 'item',
                url      : `/${routesData.inspections.root}/${routesData.inspections.reports}`,
                icon     : 'list_all',
                customIcon : 'assets/icons/essential/Reporte_inspecciones.png',
                roles    : [ 'Admin', 'InspectorsSupervisor', 'Inspector' ]
            }
        ]
    },
    {
        id       : 'sessions',
        title    : 'Administración',
        translate: 'NAV.SESSIONS.TITLE',
        description: 'NAV.SESSIONS.DESCRIPTION',
        type     : 'collapsable',
        roles    : [ 'Admin'],
        icon     : 'lock',
        customIcon : 'assets/icons/essential/Logo_iconos-05.pn',
        goToUrl  : `/${routesData.admin.root}`,
        children : [
            {
                id       : 'Access',
                title    : 'Acceso al sistema',
                translate: 'NAV.SESSIONS.Access',
                description: 'NAV.SESSIONS.Access',
                type     : 'item',
                url      : `/${routesData.admin.root}/${routesData.admin.sessions}`,
                roles    : [ 'Admin' ],
                icon     : 'lock',
                customIcon : 'assets/icons/essential/Logo_iconos-05.png',
            },

            {
                id       : 'INSPECTION',
                title    : 'Formulario de inspección',
                translate: 'NAV.SESSIONS.INSPECTION',
                type     : 'item',
                url      : `/${routesData.admin.root}/${routesData.admin.inspection}`,
                icon     : 'lock',
                customIcon : 'assets/icons/essential/Logo_iconos-05.png',
                roles    : [ 'Admin' ]
            },
        ]
    },
];
