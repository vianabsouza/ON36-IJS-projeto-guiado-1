import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { AlunoRepository } from './ports/aluno.repository';
import { Aluno } from '../domain/aluno';
import { CreateAlunoCommand } from './commands/create-aluno-command';

@Injectable()
export class AlunoService {
  constructor(private readonly alunoRepository: AlunoRepository) {}

  cadastrar(createAlunoDto: CreateAlunoCommand) {
    // Pessoas a partir de 16 anos (professores e estudantes);
    const anoAtual = new Date().getFullYear();
    const idade = anoAtual - createAlunoDto.anoNascimento;
    const IDADE_MIN_CADASTRO = 16;
    if (idade <= IDADE_MIN_CADASTRO) {
      throw new ForbiddenException('A idade mínima para cadastro é 16 anos.');
    }

    // TODO: Implentar um teste unitário para verificar essa regra

    // TO DO: Implementar a regra de negácio:
    // Não pode haver duplicação de registros de alunos, cursos e professores - identificador único;
    const alunoExistente = this.alunoRepository.buscarPorEmail(
      createAlunoDto.email,
    );
    if (alunoExistente) {
      throw new ConflictException(
        'Já existe um aluno cadastrado com esse email.',
      );
    }

    const novoAluno = new Aluno(
      createAlunoDto.nome,
      createAlunoDto.endereco,
      createAlunoDto.email,
      createAlunoDto.telefone,
    );

    const alunoCadastrado = this.alunoRepository.criar(novoAluno);
    return alunoCadastrado;
  }

  listar() {
    return this.alunoRepository.listar();
  }
}