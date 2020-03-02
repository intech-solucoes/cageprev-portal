import React from 'react';
import { RouteProps } from 'react-router-dom';

import {
    Login, EsqueciSenha,

    Home,
    DadosPessoais,
    Plano, Extrato, Resgate, Portabilidade,
    TrocarSenha,
    Relacionamento,
    Beneficios, Contracheques, ContrachequeDetalhe, RelatorioContracheque, 
    Emprestimos, EmprestimoDetalhe,
    ComprovanteRendimentos,
    ListarParticipantes
} from "./pages";

function GetRotas() {
    const rotas = [
        {
            titulo: "Login",
            caminho: "/login",
            componente: (routeProps: RouteProps) => <Login {...routeProps} />,
            mostrarMenu: false,
            exact: false
        },
        {
            titulo: "Esqueci Minha Senha",
            caminho: "/esqueciSenha",
            componente: (routeProps: RouteProps) => <EsqueciSenha {...routeProps} />,
            mostrarMenu: false,
            exact: false
        },
        {
            id: "home",
            titulo: "Home",
            icone: "fas fa-home",
            caminho: "/",
            componente: (routeProps: RouteProps) => <Home {...routeProps} />,
            mostrarMenu: true,
            exact: true
        },
        {
            id: "dados",
            titulo: "Seus Dados",
            icone: "fas fa-user",
            caminho: "/dados",
            componente: (routeProps: RouteProps) => <DadosPessoais {...routeProps} />,
            mostrarMenu: true
        },
        {
            id: "plano",
            titulo: "Seu Plano",
            icone: "fas fa-list",
            caminho: "/plano",
            componente: (routeProps: RouteProps) => <Plano {...routeProps} />,
            mostrarMenu: true
        },
        {
            id: "extrato",
            titulo: "Extrato",
            caminho: "/extrato",
            componente: (routeProps: RouteProps) => <Extrato {...routeProps} />,
            mostrarMenu: false
        },
        {
            id: "resgate",
            titulo: "Simulador de Resgate",
            caminho: "/resgate",
            componente: (routeProps: RouteProps) => <Resgate {...routeProps} />,
            mostrarMenu: false
        },
        {
            id: "portabilidade",
            titulo: "Simulador de Portabilidade",
            caminho: "/portabilidade",
            componente: (routeProps: RouteProps) => <Portabilidade {...routeProps} />,
            mostrarMenu: false
        },
        {
            id: "beneficios",
            titulo: "Seus Benefícios",
            icone: "fas fa-money-bill-alt",
            caminho: "/beneficios",
            componente: (routeProps: RouteProps) => <Beneficios {...routeProps} />,
            mostrarMenu: true,
            exact: true
        },
        {
            titulo: "Demonstrativos de Pagamento - Contracheque",
            icone: "fas fa-closed-captioning",
            caminho: "/contracheques",
            caminhoLink: "/contracheques/",
            componente: (routeProps: RouteProps) => <Contracheques {...routeProps} />,
            mostrarMenu: false, 
            exact: true
        },
        {
            titulo: "Demonstrativos de Pagamento - Contracheque",
            icone: "fas fa-closed-captioning",
            caminho: "/contracheques/:sqProcesso/:dtReferencia",
            caminhoLink: "/contracheques/",
            componente: (routeProps: RouteProps) => <ContrachequeDetalhe {...routeProps} />,
            mostrarMenu: false, 
            exact: true
        },
        {
            id: "emprestimos",
            titulo: "Empréstimos",
            icone: "fas fa-closed-captioning",
            caminho: "/emprestimos",
            componente: (routeProps: RouteProps) => <Emprestimos {...routeProps} />,
            mostrarMenu: true, 
            exact: true
        },
        {
            titulo: "Detalhes do Empréstimo",
            icone: "fas fa-closed-captioning",
            caminho: "/emprestimos/:sqContrato",
            caminhoLink: "/emprestimos/",
            componente: (routeProps: RouteProps) => <EmprestimoDetalhe {...routeProps} />,
            mostrarMenu: false, 
            exact: true
        },
        {
            id: "comprovanteRendimentos",
            titulo: "Comprovante de Rendimentos",
            icone: "fas fa-money-bill-alt",
            caminho: "/comprovanteRendimentos",
            componente: (routeProps: RouteProps) => <ComprovanteRendimentos {...routeProps} />,
            mostrarMenu: true,
            exact: true
        },
        {
            id: "trocarSenha",
            titulo: "Trocar senha",
            icone: "fas fa-lock",
            caminho: "/trocarSenha",
            componente: (routeProps: RouteProps) => <TrocarSenha {...routeProps} />,
            mostrarMenu: true
        },
        {
            id: "relacionamento",
            titulo: "Relacionamento",
            icone: "fas fa-envelope",
            caminho: "/relacionamento",
            componente: (routeProps: RouteProps) => <Relacionamento {...routeProps} />,
            mostrarMenu: true
        },
        {
            titulo: "Listar Participantes",
            caminho: "/listarParticipantes",
            componente: (routeProps: RouteProps) => <ListarParticipantes {...routeProps} />,
            mostrarMenu: false,
            exact: false,
            id: "listarParticipantes"
        }
    ];

    return rotas;
}

export default GetRotas();