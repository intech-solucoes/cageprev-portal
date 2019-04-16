import React from 'react';
import { RouteProps } from 'react-router-dom';

import {
    Login, EsqueciSenha,

    Home,
    DadosPessoais,
    TrocarSenha,
    Relacionamento,
    Beneficios, Contracheque, RelatorioContracheque
} from "./pages";
import { Plano } from './pages/Plano';

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
            titulo: "Home",
            icone: "fas fa-home",
            caminho: "/",
            componente: (routeProps: RouteProps) => <Home {...routeProps} />,
            mostrarMenu: true,
            exact: true
        },
        {
            titulo: "Seus Dados",
            icone: "fas fa-user",
            caminho: "/dados",
            componente: (routeProps: RouteProps) => <DadosPessoais {...routeProps} />,
            mostrarMenu: true
        },
        {
            titulo: "Seu Plano",
            icone: "fas fa-list",
            caminho: "/plano",
            componente: (routeProps: RouteProps) => <Plano {...routeProps} />,
            mostrarMenu: true
        },
        {
            titulo: "Seus Benefícios",
            icone: "fas fa-money-bill-alt",
            caminho: "/beneficios",
            componente: (routeProps: RouteProps) => <Beneficios {...routeProps} />,
            mostrarMenu: true,
            exact: true,
            id: "contracheque"
        },
        {
            titulo: "Contracheque",
            icone: "fas fa-closed-captioning",
            caminho: "/contracheque/:sqProcesso/:dtReferencia",
            caminhoLink: "/contracheque/",
            componente: (routeProps: RouteProps) => <Contracheque {...routeProps} />,
            mostrarMenu: false, 
            exact: true
        },
        {
            titulo: "Trocar senha",
            icone: "fas fa-lock",
            caminho: "/trocarSenha",
            componente: (routeProps: RouteProps) => <TrocarSenha {...routeProps} />,
            mostrarMenu: true
        },
        {
            titulo: "Relacionamento",
            icone: "fas fa-envelope",
            caminho: "/relacionamento",
            componente: (routeProps: RouteProps) => <Relacionamento {...routeProps} />,
            mostrarMenu: true,
            id: "dadosPessoais"
        }
    ];

    return rotas;
}

export default GetRotas();