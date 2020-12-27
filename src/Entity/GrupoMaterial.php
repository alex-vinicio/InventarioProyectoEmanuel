<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * GrupoMaterial
 *
 * @ORM\Table(name="grupo_material")
 * @ORM\Entity
 */
class GrupoMaterial
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="SEQUENCE")
     * @ORM\SequenceGenerator(sequenceName="grupo_material_id_seq", allocationSize=1, initialValue=1)
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="nombre_grupo_m", type="string", length=50, nullable=false)
     */
    private $nombreGrupoM;

    /**
     * @var string
     *
     * @ORM\Column(name="descripcion_grupo_m", type="string", length=50, nullable=false)
     */
    private $descripcionGrupoM;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombreGrupoM(): ?string
    {
        return $this->nombreGrupoM;
    }

    public function setNombreGrupoM(string $nombreGrupoM): self
    {
        $this->nombreGrupoM = $nombreGrupoM;

        return $this;
    }

    public function getDescripcionGrupoM(): ?string
    {
        return $this->descripcionGrupoM;
    }

    public function setDescripcionGrupoM(string $descripcionGrupoM): self
    {
        $this->descripcionGrupoM = $descripcionGrupoM;

        return $this;
    }


}
