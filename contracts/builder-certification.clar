;; Builder Certification Contract
;; Validates expertise in traditional methods

;; Define data variables
(define-data-var last-builder-id uint u0)

;; Define certification levels
(define-constant APPRENTICE u1)
(define-constant JOURNEYMAN u2)
(define-constant MASTER u3)

;; Define data maps
(define-map builders
  { builder-id: uint }
  {
    name: (string-utf8 100),
    certification-level: uint,
    specialties: (string-utf8 200),
    years-experience: uint,
    certifier: principal,
    certification-time: uint
  }
)

(define-map builder-addresses
  { address: principal }
  { builder-id: uint }
)

;; Register a new builder
(define-public (register-builder
    (name (string-utf8 100))
    (certification-level uint)
    (specialties (string-utf8 200))
    (years-experience uint))
  (let
    (
      (new-id (+ (var-get last-builder-id) u1))
    )
    ;; Validate certification level
    (asserts! (and (>= certification-level APPRENTICE) (<= certification-level MASTER)) (err u1))

    (map-set builders
      { builder-id: new-id }
      {
        name: name,
        certification-level: certification-level,
        specialties: specialties,
        years-experience: years-experience,
        certifier: tx-sender,
        certification-time: block-height
      }
    )

    ;; Map builder address to ID
    (map-set builder-addresses
      { address: tx-sender }
      { builder-id: new-id }
    )

    (var-set last-builder-id new-id)
    (ok new-id)
  )
)

;; Get builder details by ID
(define-read-only (get-builder-by-id (builder-id uint))
  (map-get? builders { builder-id: builder-id })
)

;; Get builder details by address
(define-read-only (get-builder-by-address (address principal))
  (match (map-get? builder-addresses { address: address })
    builder-map (map-get? builders { builder-id: (get builder-id builder-map) })
    none
  )
)

;; Check if an address is a certified builder
(define-read-only (is-certified-builder (address principal))
  (is-some (map-get? builder-addresses { address: address }))
)

;; Get the total number of certified builders
(define-read-only (get-builder-count)
  (var-get last-builder-id)
)
