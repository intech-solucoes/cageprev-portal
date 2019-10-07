import React from "react";
import packageJson from '../../../package.json';

import { PageClean } from "../";

import { Alerta, TipoAlerta } from "@intechprev/componentes-web";
import { handleFieldChange } from "@intechprev/react-lib";
import { UsuarioService } from "@intechprev/ps-web-service";
import { Link } from "react-router-dom";

import EsqueciSenha from "./EsqueciSenha";

export {
    EsqueciSenha
}

interface Props {

}

interface State {
    cpf: string;
    senha: string;
    loading: boolean;
    mensagem: string;
    erro: string;
}

export default class Login extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            cpf: "",
            senha: "",
            loading: false,
            mensagem: "",
            erro: ""
        }
    }

    onSubmit = async () => {
        await this.setState({ loading: true });

        try {
            var login = await UsuarioService.Login(this.state.cpf, this.state.senha);
            
            await localStorage.setItem("token", login.AccessToken);
            await localStorage.setItem("token-admin", login.AccessToken);
            await localStorage.setItem("pensionista", login.pensionista.toString());
            
            document.location.href = ".";
        } catch(erro) {
            if(erro.response) {
                //await this.loginForm.current.mostrarErro(erro.response.data);
                await this.setState({ erro: erro.response.data });
            } else {
                //await this.loginForm.current.mostrarErro(erro);
                //alert("Ocorreu um erro ao processar sua requisição!");
                await this.setState({ erro });
            }
        } finally {
            await this.setState({ loading: false });
        }
    }

    render() {
        return (
			<PageClean {...this.props}>
                <h4>Bem vindo ao portal da Cageprev</h4>

                <h5>
                    <b>Área de Acesso Restrito</b><br />
                    <small>Para informações, entre em contato com a <a href="http://www.cageprev.com/?page_id=13072">Cageprev</a></small><br />
                    <br />
                </h5>
                
                <form>
                    <div className="form-group">
                        <input name="cpf" id="cpf" placeholder="CPF (somente números)" type={"number"} className="form-control" maxLength={11} value={this.state.cpf} onChange={(e) => handleFieldChange(this, e)} />
                    </div>

                    <div className="form-group">
                        <input name="senha" id="senha" placeholder="Senha" type="password" className="form-control" maxLength={64} value={this.state.senha} onChange={(e) => handleFieldChange(this, e)} />
                    </div>

                    <div className="form-group">
                        <button type="submit" id="entrar" className="btn btn-block btn-primary" onClick={this.onSubmit} disabled={this.state.loading}>
                            {!this.state.loading && 
                                <span>Entrar</span>}

                            {this.state.loading &&
                                <i className="fas fa-spinner fa-pulse"></i>}
                        </button>
                    </div>

                    {this.state.mensagem !== "" && <Alerta tipo={TipoAlerta.info} mensagem={this.state.mensagem} />}
                    {this.state.erro !== "" && <Alerta tipo={TipoAlerta.danger} mensagem={this.state.erro} />}

                    <div className="form-group">
                        <Link className="btn btn-link" id="esqueciSenha" to="/esqueciSenha">Esqueci Minha Senha / Primeiro Acesso</Link>
                    </div>
                </form>
                
                <br/>
                <br/>
                <div className="text-center">
                    Versão {packageJson.version}
                </div>
            </PageClean>
        );
    }
}