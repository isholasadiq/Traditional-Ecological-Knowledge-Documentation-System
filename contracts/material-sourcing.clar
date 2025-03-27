;; Material Sourcing Contract
;; Tracks appropriate woods and other components

;; Define data variables
(define-data-var last-material-id uint u0)

;; Define data maps
(define-map materials
  { material-id: uint }
  {
    name: (string-utf8 100),
    type: (string-utf8 50),
    source-location: (string-utf8 100),
    sustainable: bool,
    registrar: principal,
    registration-time: uint
  }
)

;; Register a new material
(define-public (register-material
    (name (string-utf8 100))
    (type (string-utf8 50))
    (source-location (string-utf8 100))
    (sustainable bool))
  (let
    (
      (new-id (+ (var-get last-material-id) u1))
    )
    (map-set materials
      { material-id: new-id }
      {
        name: name,
        type: type,
        source-location: source-location,
        sustainable: sustainable,
        registrar: tx-sender,
        registration-time: block-height
      }
    )
    (var-set last-material-id new-id)
    (ok new-id)
  )
)

;; Get material details
(define-read-only (get-material (material-id uint))
  (map-get? materials { material-id: material-id })
)

;; Check if a material is sustainable
(define-read-only (is-sustainable (material-id uint))
  (match (map-get? materials { material-id: material-id })
    material (get sustainable material)
    false
  )
)

;; Get the total number of registered materials
(define-read-only (get-material-count)
  (var-get last-material-id)
)
